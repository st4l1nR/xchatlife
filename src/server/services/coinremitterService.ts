import { env } from "@/env";
import type { BillingCycle } from "../../../generated/prisma";

// Pricing configuration matching DialogUpgrade
const SUBSCRIPTION_PRICES: Record<
  BillingCycle,
  { amount: number; months: number }
> = {
  monthly: { amount: 12.99, months: 1 },
  quarterly: { amount: 23.97, months: 3 }, // $7.99 * 3
  annually: { amount: 47.88, months: 12 }, // $3.99 * 12
};

// Test prices for TCN wallet (max 10 TCN per invoice)
const TEST_SUBSCRIPTION_PRICES: Record<
  BillingCycle,
  { amount: number; months: number }
> = {
  monthly: { amount: 3, months: 1 },
  quarterly: { amount: 6, months: 3 },
  annually: { amount: 9, months: 12 },
};

// Token packages configuration
export interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  bonus: number | null;
}

export const TOKEN_PACKAGES: TokenPackage[] = [
  { id: "pack_100", tokens: 100, price: 9.99, bonus: null },
  { id: "pack_350", tokens: 350, price: 34.99, bonus: null },
  { id: "pack_550", tokens: 550, price: 49.99, bonus: 10 },
  { id: "pack_1150", tokens: 1150, price: 99.99, bonus: 15 },
  { id: "pack_2400", tokens: 2400, price: 199.99, bonus: 20 },
  { id: "pack_3750", tokens: 3750, price: 299.99, bonus: 25 },
];

// Test prices for token packages (max 10 TCN per invoice)
const TEST_TOKEN_PACKAGES: TokenPackage[] = [
  { id: "pack_100", tokens: 100, price: 1, bonus: null },
  { id: "pack_350", tokens: 350, price: 2, bonus: null },
  { id: "pack_550", tokens: 550, price: 3, bonus: 10 },
  { id: "pack_1150", tokens: 1150, price: 5, bonus: 15 },
  { id: "pack_2400", tokens: 2400, price: 7, bonus: 20 },
  { id: "pack_3750", tokens: 3750, price: 9, bonus: 25 },
];

interface CreateTokenInvoiceParams {
  userId: string;
  packageId: string;
  userEmail: string;
}

interface CreateInvoiceParams {
  userId: string;
  billingCycle: BillingCycle;
  userEmail: string;
}

interface CoinremitterInvoice {
  id: string;
  invoice_id: string;
  url: string;
  total_amount: {
    BTC: string;
    USD: string;
  };
  paid_amount: {
    BTC: string;
    USD: string;
  };
  status: string;
  status_code: number;
  expire_on: string;
  description: string;
  custom_data1: string;
  custom_data2: string;
}

interface CoinremitterResponse {
  success: boolean;
  msg?: string;
  error?: string;
  data: CoinremitterInvoice;
}

// Webhook payload from Coinremitter
export interface CoinremitterWebhookPayload {
  id: string;
  invoice_id: string;
  url: string;
  total_amount: {
    BTC: string;
    USD: string;
  };
  paid_amount: {
    BTC: string;
    USD: string;
  };
  usd_amount: string;
  conversion_rate: {
    USD_BTC: string;
    BTC_USD: string;
  };
  status: string;
  status_code: number; // 0=Pending, 1=Paid, 2=Under Paid, 3=Over Paid, 4=Expired, 5=Cancelled
  expire_on: string;
  delete_on: string;
  description: string;
  custom_data1: string; // userId
  custom_data2: string; // billingCycle
  payment_history: Array<{
    txid: string;
    amount: string;
    confirmations: number;
    date: string;
  }>;
}

export const coinremitterService = {
  getBaseUrl(): string {
    return "https://api.coinremitter.com/v1";
  },

  getHeaders(): Record<string, string> {
    return {
      "x-api-key": env.COINREMITTER_API_KEY ?? "",
      "x-api-password": env.COINREMITTER_API_PASSWORD ?? "",
      "Content-Type": "application/json",
    };
  },

  isTestMode(): boolean {
    return env.COINREMITTER_TEST_MODE === "true";
  },

  async createInvoice(
    params: CreateInvoiceParams,
  ): Promise<CoinremitterInvoice> {
    const { userId, billingCycle, userEmail } = params;
    const isTest = this.isTestMode();
    const pricing = isTest
      ? TEST_SUBSCRIPTION_PRICES[billingCycle]
      : SUBSCRIPTION_PRICES[billingCycle];

    const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // In test mode, don't specify fiat_currency (use TCN directly)
    const invoiceData: Record<string, string> = {
      amount: pricing.amount.toString(),
      expiry_time_in_minutes: "1440",
      notify_url: `${appUrl}/api/webhooks/coinremitter`,
      success_url: `${appUrl}/dashboard?subscription=success`,
      fail_url: `${appUrl}/dashboard?subscription=cancelled`,
      description: `XChatLife ${billingCycle} Subscription${isTest ? " (TEST)" : ""}`,
      email: userEmail,
      custom_data1: userId,
      custom_data2: billingCycle,
    };

    // Only add fiat_currency for production (real BTC)
    if (!isTest) {
      invoiceData.fiat_currency = "USD";
    }

    console.log("[Coinremitter] Creating invoice with data:", invoiceData);

    const response = await fetch(`${this.getBaseUrl()}/invoice/create`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(invoiceData),
    });

    const responseText = await response.text();
    console.log("[Coinremitter] API Response:", responseText);

    if (!response.ok) {
      throw new Error(`Coinremitter API error: ${responseText}`);
    }

    let result: CoinremitterResponse;
    try {
      result = JSON.parse(responseText) as CoinremitterResponse;
    } catch {
      throw new Error(`Coinremitter invalid JSON response: ${responseText}`);
    }

    if (!result.success) {
      throw new Error(
        `Coinremitter error: ${result.error ?? result.msg ?? JSON.stringify(result)}`,
      );
    }

    return result.data;
  },

  /**
   * Verify an invoice by calling Coinremitter API
   * This is used to validate webhook requests
   */
  async getInvoice(invoiceId: string): Promise<CoinremitterInvoice | null> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/invoice/get`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ invoice_id: invoiceId }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error("[Coinremitter] Failed to get invoice:", responseText);
        return null;
      }

      let result: CoinremitterResponse;
      try {
        result = JSON.parse(responseText) as CoinremitterResponse;
      } catch {
        console.error("[Coinremitter] Invalid JSON response:", responseText);
        return null;
      }

      if (!result.success) {
        console.error("[Coinremitter] Invoice not found:", invoiceId);
        return null;
      }

      return result.data;
    } catch (error) {
      console.error("[Coinremitter] Error getting invoice:", error);
      return null;
    }
  },

  parseWebhookData(
    payload: CoinremitterWebhookPayload,
  ): { userId: string; billingCycle: BillingCycle } | null {
    const userId = payload.custom_data1;
    const billingCycle = payload.custom_data2 as BillingCycle;

    if (!userId || !billingCycle) return null;
    if (!["monthly", "quarterly", "annually"].includes(billingCycle))
      return null;

    return { userId, billingCycle };
  },

  getSubscriptionMonths(billingCycle: BillingCycle): number {
    return SUBSCRIPTION_PRICES[billingCycle].months;
  },

  getPricing(billingCycle: BillingCycle): { amount: number; months: number } {
    return SUBSCRIPTION_PRICES[billingCycle];
  },

  // Status codes from Coinremitter
  isPaymentComplete(statusCode: number): boolean {
    // 1 = Paid, 3 = Over Paid (both are successful)
    return statusCode === 1 || statusCode === 3;
  },

  isPaymentPending(statusCode: number): boolean {
    // 0 = Pending, 2 = Under Paid
    return statusCode === 0 || statusCode === 2;
  },

  isPaymentFailed(statusCode: number): boolean {
    // 4 = Expired, 5 = Cancelled
    return statusCode === 4 || statusCode === 5;
  },

  // Token packages methods
  getTokenPackages(): TokenPackage[] {
    return TOKEN_PACKAGES;
  },

  getTokenPackage(packageId: string): TokenPackage | undefined {
    return TOKEN_PACKAGES.find((pkg) => pkg.id === packageId);
  },

  async createTokenPurchaseInvoice(
    params: CreateTokenInvoiceParams,
  ): Promise<CoinremitterInvoice> {
    const { userId, packageId, userEmail } = params;
    const isTest = this.isTestMode();

    const packages = isTest ? TEST_TOKEN_PACKAGES : TOKEN_PACKAGES;
    const tokenPackage = packages.find((pkg) => pkg.id === packageId);

    if (!tokenPackage) {
      throw new Error(`Invalid token package: ${packageId}`);
    }

    const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const invoiceData: Record<string, string> = {
      amount: tokenPackage.price.toString(),
      expiry_time_in_minutes: "1440",
      notify_url: `${appUrl}/api/webhooks/coinremitter`,
      success_url: `${appUrl}/buy-tokens?purchase=success`,
      fail_url: `${appUrl}/buy-tokens?purchase=cancelled`,
      description: `XChatLife ${tokenPackage.tokens} Tokens${isTest ? " (TEST)" : ""}`,
      email: userEmail,
      custom_data1: userId,
      custom_data2: `tokens-${packageId.replace(/_/g, "-")}`,
    };

    // Only add fiat_currency for production (real BTC)
    if (!isTest) {
      invoiceData.fiat_currency = "USD";
    }

    console.log("[Coinremitter] Creating token purchase invoice:", invoiceData);

    const response = await fetch(`${this.getBaseUrl()}/invoice/create`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(invoiceData),
    });

    const responseText = await response.text();
    console.log("[Coinremitter] API Response:", responseText);

    if (!response.ok) {
      throw new Error(`Coinremitter API error: ${responseText}`);
    }

    let result: CoinremitterResponse;
    try {
      result = JSON.parse(responseText) as CoinremitterResponse;
    } catch {
      throw new Error(`Coinremitter invalid JSON response: ${responseText}`);
    }

    if (!result.success) {
      throw new Error(
        `Coinremitter error: ${result.error ?? result.msg ?? JSON.stringify(result)}`,
      );
    }

    return result.data;
  },

  parseTokenPurchaseData(
    payload: CoinremitterWebhookPayload,
  ): { userId: string; packageId: string } | null {
    const userId = payload.custom_data1;
    const customData2 = payload.custom_data2;

    if (!userId || !customData2) return null;
    if (!customData2.startsWith("tokens-")) return null;

    // Convert from "tokens-pack-550" back to "pack_550"
    const packageIdWithHyphens = customData2.replace("tokens-", "");
    const packageId = packageIdWithHyphens.replace(/-/g, "_");
    const validPackage = TOKEN_PACKAGES.find((pkg) => pkg.id === packageId);

    if (!validPackage) return null;

    return { userId, packageId };
  },

  isTokenPurchase(customData2: string): boolean {
    return customData2.startsWith("tokens-");
  },
};
