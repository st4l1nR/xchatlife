import { env } from "@/env";
import crypto from "crypto";

const BASE_URL = "https://api.nowpayments.io/v1";

// JWT token cache (expires in 5 min, we refresh at 4 min)
let cachedJwtToken: string | null = null;
let tokenExpiresAt = 0;
const TOKEN_CACHE_MS = 4 * 60 * 1000; // 4 minutes

/**
 * Get JWT token for NOWPayments API (subscriptions endpoints)
 * Token is cached for 4 minutes (expires in 5)
 */
async function getJwtToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedJwtToken && Date.now() < tokenExpiresAt) {
    return cachedJwtToken;
  }

  if (!env.NOWPAYMENTS_EMAIL || !env.NOWPAYMENTS_PASSWORD) {
    throw new Error("NOWPayments email/password not configured");
  }

  const response = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: env.NOWPAYMENTS_EMAIL,
      password: env.NOWPAYMENTS_PASSWORD,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[NOWPayments] Auth failed:", error);
    throw new Error("NOWPayments authentication failed");
  }

  const data = (await response.json()) as { token: string };
  cachedJwtToken = data.token;
  tokenExpiresAt = Date.now() + TOKEN_CACHE_MS;

  return cachedJwtToken;
}

// Headers for subscription endpoints (require Bearer token)
const getSubscriptionHeaders = async () => {
  const token = await getJwtToken();
  return {
    Authorization: `Bearer ${token}`,
    "x-api-key": env.NOWPAYMENTS_API_KEY ?? "",
    "Content-Type": "application/json",
  };
};

// Response types
export interface NowPaymentsSubscription {
  id: string;
  subscription_plan_id: string;
  is_active: boolean;
  status: "WAITING_PAY" | "PAID" | "EXPIRED";
  expire_date: string;
  subscriber: { email: string };
  created_at: string;
  updated_at: string;
}

interface NowPaymentsSubscriptionResponse {
  result: NowPaymentsSubscription;
}

// One-time payment response
export interface NowPaymentsPayment {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  invoice_url: string;
  created_at: string;
  updated_at: string;
}

// Subscription plan response from NOWPayments
export interface NowPaymentsPlan {
  id: number;
  title: string;
  interval_day: number;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

// IPN webhook payload from NOWPayments
export interface NowPaymentsIpnPayload {
  payment_id: number;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id?: string;
  order_description?: string;
  purchase_id?: string;
  subscription_id?: string;
  created_at: string;
  updated_at: string;
  outcome_amount?: number;
  outcome_currency?: string;
  actually_paid?: number;
  actually_paid_at_fiat?: number;
}

// Helper to sort object keys (required for signature verification)
function sortObjectKeys(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(obj)
    .sort()
    .reduce(
      (result, key) => {
        result[key] = obj[key];
        return result;
      },
      {} as Record<string, unknown>,
    );
}

export const nowpaymentsService = {
  /**
   * Check if NOWPayments is configured
   */
  isConfigured(): boolean {
    return !!(
      env.NOWPAYMENTS_API_KEY &&
      env.NOWPAYMENTS_EMAIL &&
      env.NOWPAYMENTS_PASSWORD
    );
  },

  /**
   * Create email subscription - sends payment link to customer email
   * NOWPayments handles sending emails and renewal reminders
   */
  async createEmailSubscription(params: {
    email: string;
    nowpaymentsPlanId: number;
  }): Promise<NowPaymentsSubscription> {
    if (!this.isConfigured()) {
      throw new Error("NOWPayments is not configured");
    }

    const response = await fetch(`${BASE_URL}/subscriptions`, {
      method: "POST",
      headers: await getSubscriptionHeaders(),
      body: JSON.stringify({
        subscription_plan_id: params.nowpaymentsPlanId,
        email: params.email,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[NOWPayments] Create subscription error:", error);
      throw new Error(`NOWPayments error: ${error}`);
    }

    const data = (await response.json()) as NowPaymentsSubscriptionResponse;
    return data.result;
  },

  /**
   * Get subscription details by ID
   */
  async getSubscription(
    subscriptionId: string,
  ): Promise<NowPaymentsSubscription | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/subscriptions/${subscriptionId}`,
        {
          method: "GET",
          headers: await getSubscriptionHeaders(),
        },
      );

      if (!response.ok) {
        console.error(
          "[NOWPayments] Get subscription error:",
          await response.text(),
        );
        return null;
      }

      const data = (await response.json()) as NowPaymentsSubscriptionResponse;
      return data.result;
    } catch (error) {
      console.error("[NOWPayments] Error getting subscription:", error);
      return null;
    }
  },

  /**
   * Cancel/delete a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error("NOWPayments is not configured");
    }

    const response = await fetch(
      `${BASE_URL}/subscriptions/${subscriptionId}`,
      {
        method: "DELETE",
        headers: await getSubscriptionHeaders(),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[NOWPayments] Cancel subscription error:", error);
      throw new Error("Failed to cancel subscription");
    }
  },

  /**
   * Create a one-time payment for token purchase
   * Returns payment URL for user to complete payment
   */
  async createTokenPayment(params: {
    userId: string;
    packageId: string;
    amount: number;
    description: string;
  }): Promise<NowPaymentsPayment> {
    if (!env.NOWPAYMENTS_API_KEY) {
      throw new Error("NOWPayments API key is not configured");
    }

    const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const response = await fetch(`${BASE_URL}/payment`, {
      method: "POST",
      headers: {
        "x-api-key": env.NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: params.amount,
        price_currency: "usd",
        order_id: `tokens_${params.userId}_${params.packageId}_${Date.now()}`,
        order_description: params.description,
        ipn_callback_url: `${appUrl}/api/webhooks/nowpayments`,
        success_url: `${appUrl}/buy-tokens?purchase=success`,
        cancel_url: `${appUrl}/buy-tokens?purchase=cancelled`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[NOWPayments] Create token payment error:", error);
      throw new Error(`NOWPayments error: ${error}`);
    }

    return response.json() as Promise<NowPaymentsPayment>;
  },

  /**
   * Parse token purchase order_id to extract userId and packageId
   * Order ID format: tokens_<userId>_<packageId>_<timestamp>
   */
  parseTokenOrderId(
    orderId: string,
  ): { userId: string; packageId: string } | null {
    if (!orderId.startsWith("tokens_")) return null;

    const parts = orderId.split("_");
    // Format: tokens_<userId>_<packageId>_<timestamp>
    // But userId and packageId could contain underscores, so we need to be careful
    // Assuming packageId is like "pack_100", we know timestamp is the last part
    if (parts.length < 4) return null;

    // Remove 'tokens' prefix and timestamp suffix
    const timestamp = parts[parts.length - 1] ?? "";
    if (!/^\d+$/.test(timestamp)) return null;

    // The packageId format is "pack_XXX", so find it
    const remaining = parts.slice(1, -1).join("_"); // Remove 'tokens_' and '_timestamp'

    // Find the last occurrence of pack_
    const packIndex = remaining.lastIndexOf("pack_");
    if (packIndex === -1) return null;

    const userId = remaining.substring(0, packIndex - 1); // -1 to remove the underscore before pack_
    const packageId = remaining.substring(packIndex);

    if (!userId || !packageId) return null;

    return { userId, packageId };
  },

  /**
   * Check if an order_id is for a token purchase
   */
  isTokenPurchaseOrder(orderId: string | undefined): boolean {
    return orderId?.startsWith("tokens_") ?? false;
  },

  /**
   * Verify IPN webhook signature (HMAC-SHA512)
   * NOWPayments signs webhooks using HMAC-SHA512
   */
  verifyIpnSignature(
    payload: Record<string, unknown>,
    signature: string,
  ): boolean {
    if (!env.NOWPAYMENTS_IPN_SECRET) {
      console.error("[NOWPayments] IPN secret not configured");
      return false;
    }

    try {
      const sorted = sortObjectKeys(payload);
      const hmac = crypto.createHmac("sha512", env.NOWPAYMENTS_IPN_SECRET);
      hmac.update(JSON.stringify(sorted));
      const calculatedSignature = hmac.digest("hex");
      return calculatedSignature === signature;
    } catch (error) {
      console.error("[NOWPayments] Signature verification error:", error);
      return false;
    }
  },

  // Payment status helpers
  isPaymentFinished(status: string): boolean {
    return status === "finished";
  },

  isPaymentWaiting(status: string): boolean {
    return ["waiting", "confirming", "confirmed", "sending"].includes(status);
  },

  isPaymentFailed(status: string): boolean {
    return ["failed", "refunded", "expired"].includes(status);
  },

  isPaymentPartiallyPaid(status: string): boolean {
    return status === "partially_paid";
  },

  // Subscription status helpers
  isSubscriptionActive(status: string): boolean {
    return status === "PAID";
  },

  isSubscriptionWaitingPayment(status: string): boolean {
    return status === "WAITING_PAY";
  },

  isSubscriptionExpired(status: string): boolean {
    return status === "EXPIRED";
  },

  // ==================== SUBSCRIPTION PLAN MANAGEMENT ====================

  /**
   * Convert months to interval days for NOWPayments
   * NOWPayments uses interval_day for billing frequency
   */
  monthsToIntervalDays(months: number): number {
    return months * 30;
  },

  /**
   * Create a subscription plan in NOWPayments
   */
  async createPlan(params: {
    title: string;
    intervalDays: number;
    amount: number;
    currency?: string;
  }): Promise<NowPaymentsPlan> {
    if (!this.isConfigured()) {
      throw new Error("NOWPayments is not configured");
    }

    const response = await fetch(`${BASE_URL}/subscriptions/plans`, {
      method: "POST",
      headers: await getSubscriptionHeaders(),
      body: JSON.stringify({
        title: params.title,
        interval_day: params.intervalDays,
        amount: params.amount,
        currency: params.currency ?? "usd",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[NOWPayments] Create plan error:", error);
      throw new Error(`NOWPayments error: ${error}`);
    }

    const data = (await response.json()) as { result: NowPaymentsPlan };
    return data.result;
  },

  /**
   * Update a subscription plan in NOWPayments
   * Note: NOWPayments may have limitations on what can be updated
   */
  async updatePlan(
    planId: number,
    params: {
      title?: string;
      amount?: number;
    },
  ): Promise<NowPaymentsPlan> {
    if (!this.isConfigured()) {
      throw new Error("NOWPayments is not configured");
    }

    const response = await fetch(`${BASE_URL}/subscriptions/plans/${planId}`, {
      method: "PATCH",
      headers: await getSubscriptionHeaders(),
      body: JSON.stringify({
        ...(params.title && { title: params.title }),
        ...(params.amount && { amount: params.amount }),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[NOWPayments] Update plan error:", error);
      throw new Error(`NOWPayments error: ${error}`);
    }

    const data = (await response.json()) as { result: NowPaymentsPlan };
    return data.result;
  },

  /**
   * Get a subscription plan by ID from NOWPayments
   */
  async getPlan(planId: number): Promise<NowPaymentsPlan | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/subscriptions/plans/${planId}`,
        {
          method: "GET",
          headers: await getSubscriptionHeaders(),
        },
      );

      if (!response.ok) {
        console.error("[NOWPayments] Get plan error:", await response.text());
        return null;
      }

      const data = (await response.json()) as { result: NowPaymentsPlan };
      return data.result;
    } catch (error) {
      console.error("[NOWPayments] Error getting plan:", error);
      return null;
    }
  },

  /**
   * Get all subscription plans from NOWPayments
   */
  async getPlans(): Promise<NowPaymentsPlan[]> {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const response = await fetch(`${BASE_URL}/subscriptions/plans`, {
        method: "GET",
        headers: await getSubscriptionHeaders(),
      });

      if (!response.ok) {
        console.error("[NOWPayments] Get plans error:", await response.text());
        return [];
      }

      const data = (await response.json()) as { result: NowPaymentsPlan[] };
      return data.result;
    } catch (error) {
      console.error("[NOWPayments] Error getting plans:", error);
      return [];
    }
  },
};
