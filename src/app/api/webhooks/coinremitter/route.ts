import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import {
  coinremitterService,
  type CoinremitterWebhookPayload,
} from "@/server/services/coinremitterService";
import { subscriptionService } from "@/server/services/subscriptionService";
import { tokenPurchaseService } from "@/server/services/tokenPurchaseService";

export async function POST(request: NextRequest) {
  try {
    // Coinremitter sends webhook as form data, URL-encoded, or JSON
    const contentType = request.headers.get("content-type") ?? "";

    // Clone request to read body for checking if empty
    const clonedRequest = request.clone();
    const rawBody = await clonedRequest.text();

    // Handle empty body (Coinremitter verification ping)
    if (!rawBody || rawBody.trim() === "") {
      console.log("[Coinremitter Webhook] Empty body - verification ping");
      return NextResponse.json({
        success: true,
        message: "Webhook endpoint active",
      });
    }

    let payload: CoinremitterWebhookPayload;

    if (contentType.includes("application/json")) {
      try {
        payload = JSON.parse(rawBody) as CoinremitterWebhookPayload;
      } catch {
        console.log("[Coinremitter Webhook] Invalid JSON, treating as ping");
        return NextResponse.json({ success: true, message: "pong" });
      }
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      !contentType
    ) {
      // Handle URL-encoded form data (most common from Coinremitter)
      const params = new URLSearchParams(rawBody);

      // Check if it's just a ping test
      if (params.has("ping") || params.toString() === "") {
        console.log("[Coinremitter Webhook] Ping received");
        return NextResponse.json({ success: true, message: "pong" });
      }

      // Convert URLSearchParams to object
      const rawPayload: Record<string, string> = {};
      params.forEach((value, key) => {
        rawPayload[key] = value;
      });

      payload = rawPayload as unknown as CoinremitterWebhookPayload;

      // Parse nested objects if they come as strings
      if (typeof payload.total_amount === "string") {
        try {
          payload.total_amount = JSON.parse(payload.total_amount);
        } catch {
          // Keep as string if not valid JSON
        }
      }
      if (typeof payload.paid_amount === "string") {
        try {
          payload.paid_amount = JSON.parse(payload.paid_amount);
        } catch {
          // Keep as string if not valid JSON
        }
      }
    } else {
      // Handle multipart form data
      try {
        // Re-create request with the body for formData parsing
        const formDataRequest = new Request(request.url, {
          method: "POST",
          headers: request.headers,
          body: rawBody,
        });
        const formData = await formDataRequest.formData();

        // Check if it's just a ping test
        if (formData.has("ping")) {
          console.log("[Coinremitter Webhook] Ping received");
          return NextResponse.json({ success: true, message: "pong" });
        }

        payload = Object.fromEntries(
          formData,
        ) as unknown as CoinremitterWebhookPayload;

        // Parse nested objects if they come as strings
        if (typeof payload.total_amount === "string") {
          payload.total_amount = JSON.parse(
            payload.total_amount as unknown as string,
          );
        }
        if (typeof payload.paid_amount === "string") {
          payload.paid_amount = JSON.parse(
            payload.paid_amount as unknown as string,
          );
        }
      } catch (formError) {
        console.error(
          "[Coinremitter Webhook] Failed to parse request body:",
          formError,
        );
        console.log("[Coinremitter Webhook] Raw body:", rawBody);
        // Return 200 anyway for verification purposes
        return NextResponse.json({ success: true, message: "Received" });
      }
    }

    console.log("[Coinremitter Webhook] Content-Type:", contentType);
    console.log("[Coinremitter Webhook] Received:", {
      invoiceId: payload.invoice_id,
      status: payload.status,
      statusCode: payload.status_code,
      customData1: payload.custom_data1,
      customData2: payload.custom_data2,
    });

    // Validate required fields
    if (!payload.invoice_id) {
      console.error("[Coinremitter Webhook] Missing invoice_id in payload");
      return NextResponse.json(
        { error: "Missing invoice_id" },
        { status: 400 },
      );
    }

    // 1. SECURITY: Verify invoice exists and status matches by calling Coinremitter API
    const verifiedInvoice = await coinremitterService.getInvoice(
      payload.invoice_id,
    );
    if (!verifiedInvoice) {
      console.error(
        "[Coinremitter Webhook] Invoice verification failed - invoice not found",
      );
      return NextResponse.json(
        { error: "Invoice verification failed" },
        { status: 401 },
      );
    }

    // Convert status codes to numbers for comparison (webhook might send as string)
    const webhookStatusCode = Number(payload.status_code);
    const actualStatusCode = Number(verifiedInvoice.status_code);

    // Verify the status matches what was sent in webhook
    if (actualStatusCode !== webhookStatusCode) {
      console.error("[Coinremitter Webhook] Status mismatch:", {
        webhookStatus: webhookStatusCode,
        actualStatus: actualStatusCode,
      });
      return NextResponse.json({ error: "Status mismatch" }, { status: 401 });
    }

    console.log("[Coinremitter Webhook] Invoice verified successfully");

    // 2. Determine if this is a token purchase or subscription
    const isTokenPurchase = coinremitterService.isTokenPurchase(
      payload.custom_data2 ?? "",
    );
    const statusCode = Number(payload.status_code);
    const paymentAmount = parseFloat(
      payload.paid_amount?.USD ?? payload.usd_amount ?? "0",
    );

    if (isTokenPurchase) {
      // ==================== TOKEN PURCHASE FLOW ====================
      const tokenData = coinremitterService.parseTokenPurchaseData(payload);
      if (!tokenData) {
        console.error(
          "[Coinremitter Webhook] Invalid token purchase data:",
          payload.custom_data1,
          payload.custom_data2,
        );
        return NextResponse.json(
          { error: "Invalid token purchase data" },
          { status: 400 },
        );
      }

      const { userId, packageId } = tokenData;

      if (coinremitterService.isPaymentComplete(statusCode)) {
        // Status 1 (Paid) or 3 (Over Paid)
        console.log(
          "[Coinremitter Webhook] Token purchase confirmed for:",
          userId,
          "package:",
          packageId,
        );

        await tokenPurchaseService.processTokenPurchase(
          userId,
          packageId,
          payload.invoice_id,
          paymentAmount,
        );

        console.log(
          "[Coinremitter Webhook] Token purchase processed successfully",
        );
      } else if (coinremitterService.isPaymentPending(statusCode)) {
        console.log(
          "[Coinremitter Webhook] Token purchase pending for:",
          userId,
        );
      } else if (coinremitterService.isPaymentFailed(statusCode)) {
        console.log(
          `[Coinremitter Webhook] Token purchase ${payload.status} for:`,
          userId,
        );
      }
    } else {
      // ==================== SUBSCRIPTION FLOW ====================
      const orderData = coinremitterService.parseWebhookData(payload);
      if (!orderData) {
        console.error(
          "[Coinremitter Webhook] Invalid subscription data:",
          payload.custom_data1,
          payload.custom_data2,
        );
        return NextResponse.json(
          { error: "Invalid subscription data" },
          { status: 400 },
        );
      }

      const { userId, billingCycle } = orderData;

      // Check for duplicate processing (idempotency)
      const existingSubscription = await db.subscription.findUnique({
        where: { userId },
      });

      if (
        existingSubscription?.coinGateOrderId === payload.invoice_id &&
        existingSubscription?.status === "active"
      ) {
        console.log(
          "[Coinremitter Webhook] Subscription invoice already processed:",
          payload.invoice_id,
        );
        return NextResponse.json({
          success: true,
          message: "Already processed",
        });
      }

      if (coinremitterService.isPaymentComplete(statusCode)) {
        // Status 1 (Paid) or 3 (Over Paid)
        console.log(
          "[Coinremitter Webhook] Subscription payment confirmed for:",
          userId,
        );

        await subscriptionService.activateSubscription(
          userId,
          billingCycle,
          payload.invoice_id,
          paymentAmount,
        );

        console.log(
          "[Coinremitter Webhook] Subscription activated successfully",
        );
      } else if (coinremitterService.isPaymentPending(statusCode)) {
        // Status 0 (Pending) or 2 (Under Paid)
        console.log(
          "[Coinremitter Webhook] Subscription payment pending for:",
          userId,
        );

        if (existingSubscription) {
          await db.subscription.update({
            where: { userId },
            data: { status: "pending" },
          });
        }
      } else if (coinremitterService.isPaymentFailed(statusCode)) {
        // Status 4 (Expired) or 5 (Cancelled)
        console.log(
          `[Coinremitter Webhook] Subscription payment ${payload.status} for:`,
          userId,
        );

        if (existingSubscription?.coinGateOrderId === payload.invoice_id) {
          await db.subscription.update({
            where: { userId },
            data: { status: "expired" },
          });
        }
      } else {
        console.log(
          "[Coinremitter Webhook] Unhandled status code:",
          statusCode,
        );
      }
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Coinremitter Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Coinremitter may send GET requests to verify the endpoint
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
