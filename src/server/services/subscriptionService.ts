import { db } from "@/server/db";
import { tokenService } from "./tokenService";
import { nowpaymentsService } from "./nowpaymentsService";
import type { BillingCycle } from "../../../generated/prisma";

// Fallback months mapping when plan is not available
const BILLING_CYCLE_MONTHS: Record<BillingCycle, number> = {
  monthly: 1,
  quarterly: 3,
  annually: 12,
};

// Default tokens per month (fallback when plan doesn't specify)
const DEFAULT_TOKENS_PER_MONTH = 100;

export const subscriptionService = {
  /**
   * Activate a subscription after successful payment
   * Creates all necessary records in a single transaction
   * @param provider - "nowpayments" or "coinremitter" (legacy)
   */
  async activateSubscription(
    userId: string,
    billingCycle: BillingCycle,
    invoiceId: string,
    paymentAmount: number,
    options?: {
      provider?: "nowpayments" | "coinremitter";
      nowpaymentsSubscriptionId?: string;
      planId?: string;
      tokensGranted?: number;
    },
  ): Promise<void> {
    const now = new Date();
    const months = BILLING_CYCLE_MONTHS[billingCycle];
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + months);

    // Determine tokens: use provided value, fetch from plan, or use default
    let totalTokens = options?.tokensGranted;

    if (!totalTokens && options?.planId) {
      // Try to get tokens from the plan
      const plan = await db.subscription_plan.findUnique({
        where: { id: options.planId },
        select: { tokensGranted: true },
      });
      totalTokens = plan?.tokensGranted;
    }

    // Final fallback: calculate from default tokens per month
    if (!totalTokens) {
      totalTokens = DEFAULT_TOKENS_PER_MONTH * months;
    }

    const provider = options?.provider ?? "nowpayments";

    await db.$transaction(async (tx) => {
      // 1. Upsert subscription record
      await tx.subscription.upsert({
        where: { userId },
        create: {
          userId,
          billingCycle,
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          coinGateOrderId: provider === "coinremitter" ? invoiceId : null,
          nowpaymentsSubscriptionId: options?.nowpaymentsSubscriptionId ?? null,
          planId: options?.planId ?? null,
        },
        update: {
          billingCycle,
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          coinGateOrderId: provider === "coinremitter" ? invoiceId : undefined,
          nowpaymentsSubscriptionId: options?.nowpaymentsSubscriptionId,
          planId: options?.planId,
          cancelledAt: null,
        },
      });

      // 2. Add tokens to user balance using tokenService
      await tokenService.addTokens(
        userId,
        totalTokens,
        "subscription_renewal",
        `${billingCycle} subscription activated - ${totalTokens} tokens`,
        { invoiceId, billingCycle, provider, planId: options?.planId },
        tx,
      );

      // 3. Get or create subscription income category
      let category = await tx.financial_category.findFirst({
        where: { name: "subscription_income" },
      });

      if (!category) {
        category = await tx.financial_category.create({
          data: {
            name: "subscription_income",
            label: "Subscription Income",
            type: "income",
            group: "subscriptions",
            description: "Income from subscription payments",
          },
        });
      }

      // 4. Create financial transaction for income tracking
      await tx.financial_transaction.create({
        data: {
          categoryId: category.id,
          type: "income",
          amount: paymentAmount,
          currency: "USD",
          description: `${billingCycle} subscription payment via ${provider}`,
          userId,
          externalId: invoiceId,
          provider,
          periodStart: now,
          periodEnd: periodEnd,
          metadata: {
            billingCycle,
            tokensGranted: totalTokens,
            paymentMethod: "crypto",
            nowpaymentsSubscriptionId: options?.nowpaymentsSubscriptionId,
          },
        },
      });
    });
  },

  /**
   * Cancel a subscription (remains active until period end)
   * Also cancels the NOWPayments subscription if applicable
   */
  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await db.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    // Cancel in NOWPayments if there's a subscription ID
    if (subscription.nowpaymentsSubscriptionId) {
      try {
        await nowpaymentsService.cancelSubscription(
          subscription.nowpaymentsSubscriptionId,
        );
      } catch (error) {
        console.error("[Subscription] Failed to cancel in NOWPayments:", error);
        // Continue with local cancellation even if NOWPayments fails
      }
    }

    await db.subscription.update({
      where: { userId },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
    });
  },

  /**
   * Check for and expire subscriptions that have passed their end date
   * This should be called by a cron job
   */
  async checkAndExpireSubscriptions(): Promise<number> {
    const now = new Date();
    const result = await db.subscription.updateMany({
      where: {
        status: "active",
        currentPeriodEnd: { lt: now },
      },
      data: {
        status: "expired",
      },
    });
    return result.count;
  },

  /**
   * Get subscription months for a billing cycle
   */
  getSubscriptionMonths(billingCycle: BillingCycle): number {
    return BILLING_CYCLE_MONTHS[billingCycle];
  },

  /**
   * Find subscription by NOWPayments subscription ID
   */
  async findByNowpaymentsSubscriptionId(nowpaymentsSubscriptionId: string) {
    return db.subscription.findFirst({
      where: { nowpaymentsSubscriptionId },
      include: {
        user: { select: { id: true, email: true, name: true } },
        plan: true,
      },
    });
  },

  /**
   * Get active subscription plan by billing cycle
   */
  async getActivePlan(billingCycle: BillingCycle) {
    return db.subscription_plan.findFirst({
      where: { billingCycle, isActive: true },
    });
  },
};
