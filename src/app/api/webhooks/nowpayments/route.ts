import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import {
  nowpaymentsService,
  type NowPaymentsIpnPayload,
} from "@/server/services/nowpaymentsService";
import { subscriptionService } from "@/server/services/subscriptionService";
import { tokenPurchaseService } from "@/server/services/tokenPurchaseService";

export async function POST(request: NextRequest) {
  try {
    // Get IPN signature from header
    const signature = request.headers.get("x-nowpayments-sig");

    if (!signature) {
      console.error("[NOWPayments Webhook] Missing signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Parse payload
    const payload = (await request.json()) as NowPaymentsIpnPayload;

    console.log("[NOWPayments Webhook] Received:", {
      paymentId: payload.payment_id,
      paymentStatus: payload.payment_status,
      subscriptionId: payload.subscription_id,
      priceAmount: payload.price_amount,
      priceCurrency: payload.price_currency,
    });

    // Verify IPN signature
    if (
      !nowpaymentsService.verifyIpnSignature(
        payload as unknown as Record<string, unknown>,
        signature,
      )
    ) {
      console.error("[NOWPayments Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("[NOWPayments Webhook] Signature verified");

    // Handle token purchase payments (order_id starts with "tokens_")
    if (nowpaymentsService.isTokenPurchaseOrder(payload.order_id)) {
      return handleTokenPurchasePayment(payload);
    }

    // Handle subscription payments
    if (payload.subscription_id) {
      return handleSubscriptionPayment(payload);
    }

    // Handle other one-time payments
    console.log("[NOWPayments Webhook] Unhandled payment type:", payload);
    return NextResponse.json({ success: true, message: "Acknowledged" });
  } catch (error) {
    console.error("[NOWPayments Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function handleSubscriptionPayment(payload: NowPaymentsIpnPayload) {
  const subscriptionId = payload.subscription_id;

  if (!subscriptionId) {
    console.error("[NOWPayments Webhook] Missing subscription_id");
    return NextResponse.json(
      { error: "Missing subscription_id" },
      { status: 400 },
    );
  }

  // Find subscription by NOWPayments subscription ID
  const subscription = await db.subscription.findFirst({
    where: { nowpaymentsSubscriptionId: subscriptionId },
    include: {
      user: { select: { id: true, email: true } },
      plan: true,
    },
  });

  if (!subscription) {
    console.error(
      "[NOWPayments Webhook] Subscription not found:",
      subscriptionId,
    );
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 },
    );
  }

  const paymentStatus = payload.payment_status;
  const paymentId = String(payload.payment_id);
  const paymentAmount = payload.price_amount ?? 0;

  // Check for duplicate processing (idempotency)
  const existingTransaction = await db.financial_transaction.findFirst({
    where: { externalId: paymentId },
  });

  if (existingTransaction) {
    console.log("[NOWPayments Webhook] Payment already processed:", paymentId);
    return NextResponse.json({ success: true, message: "Already processed" });
  }

  if (nowpaymentsService.isPaymentFinished(paymentStatus)) {
    // Payment completed - activate/renew subscription
    console.log(
      "[NOWPayments Webhook] Payment completed for subscription:",
      subscriptionId,
    );

    const tokensGranted = subscription.plan?.tokensGranted;

    await subscriptionService.activateSubscription(
      subscription.userId,
      subscription.billingCycle,
      paymentId,
      paymentAmount,
      {
        provider: "nowpayments",
        nowpaymentsSubscriptionId: subscriptionId,
        planId: subscription.planId ?? undefined,
        tokensGranted: tokensGranted ?? undefined,
      },
    );

    console.log(
      "[NOWPayments Webhook] Subscription activated for user:",
      subscription.userId,
    );
  } else if (nowpaymentsService.isPaymentWaiting(paymentStatus)) {
    // Payment is pending confirmation
    console.log(
      "[NOWPayments Webhook] Payment pending for subscription:",
      subscriptionId,
    );

    // Update subscription status to pending if not already
    if (subscription.status !== "pending") {
      await db.subscription.update({
        where: { id: subscription.id },
        data: { status: "pending" },
      });
    }
  } else if (nowpaymentsService.isPaymentFailed(paymentStatus)) {
    // Payment failed
    console.log(
      `[NOWPayments Webhook] Payment ${paymentStatus} for subscription:`,
      subscriptionId,
    );

    // If subscription was pending, mark it as expired
    if (subscription.status === "pending") {
      await db.subscription.update({
        where: { id: subscription.id },
        data: { status: "expired" },
      });
    }
  } else if (nowpaymentsService.isPaymentPartiallyPaid(paymentStatus)) {
    // Partial payment received
    console.log(
      "[NOWPayments Webhook] Partial payment received for subscription:",
      subscriptionId,
    );
    // Keep as pending, user needs to complete payment
  } else {
    console.log(
      "[NOWPayments Webhook] Unhandled payment status:",
      paymentStatus,
    );
  }

  return NextResponse.json({ success: true });
}

/**
 * Handle token purchase payment from NOWPayments
 */
async function handleTokenPurchasePayment(payload: NowPaymentsIpnPayload) {
  const orderId = payload.order_id;

  if (!orderId) {
    console.error("[NOWPayments Webhook] Missing order_id for token purchase");
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  // Parse order_id to get userId and packageId
  const orderData = nowpaymentsService.parseTokenOrderId(orderId);
  if (!orderData) {
    console.error("[NOWPayments Webhook] Invalid token order_id:", orderId);
    return NextResponse.json({ error: "Invalid order_id" }, { status: 400 });
  }

  const { userId, packageId } = orderData;
  const paymentId = String(payload.payment_id);
  const paymentAmount = payload.price_amount ?? 0;
  const paymentStatus = payload.payment_status;

  console.log("[NOWPayments Webhook] Token purchase:", {
    userId,
    packageId,
    paymentId,
    paymentStatus,
  });

  // Check for duplicate processing (idempotency)
  const existingTransaction = await db.financial_transaction.findFirst({
    where: { externalId: paymentId },
  });

  if (existingTransaction) {
    console.log(
      "[NOWPayments Webhook] Token payment already processed:",
      paymentId,
    );
    return NextResponse.json({ success: true, message: "Already processed" });
  }

  if (nowpaymentsService.isPaymentFinished(paymentStatus)) {
    // Payment completed - credit tokens to user
    console.log(
      "[NOWPayments Webhook] Token payment completed for user:",
      userId,
    );

    try {
      await tokenPurchaseService.processTokenPurchase(
        userId,
        packageId,
        paymentId,
        paymentAmount,
        "nowpayments",
      );

      console.log("[NOWPayments Webhook] Tokens credited to user:", userId);
    } catch (error) {
      console.error(
        "[NOWPayments Webhook] Failed to process token purchase:",
        error,
      );
      return NextResponse.json(
        { error: "Failed to process token purchase" },
        { status: 500 },
      );
    }
  } else if (nowpaymentsService.isPaymentWaiting(paymentStatus)) {
    console.log(
      "[NOWPayments Webhook] Token payment pending for user:",
      userId,
    );
  } else if (nowpaymentsService.isPaymentFailed(paymentStatus)) {
    console.log(
      `[NOWPayments Webhook] Token payment ${paymentStatus} for user:`,
      userId,
    );
  } else {
    console.log(
      "[NOWPayments Webhook] Unhandled token payment status:",
      paymentStatus,
    );
  }

  return NextResponse.json({ success: true });
}

// NOWPayments may send GET requests to verify the endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", provider: "nowpayments" });
}
