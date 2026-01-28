import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  coinremitterService,
  TOKEN_PACKAGES,
} from "@/server/services/coinremitterService";
import { nowpaymentsService } from "@/server/services/nowpaymentsService";
import { subscriptionService } from "@/server/services/subscriptionService";

const billingCycleSchema = z.enum(["monthly", "quarterly", "annually"]);

// Schema for admin dashboard query
const getForDashboardSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  status: z.enum(["active", "cancelled", "expired", "pending"]).optional(),
  sortBy: z.enum(["createdAt", "currentPeriodEnd"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Schema for admin plans query
const getPlansAdminSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  billingCycle: billingCycleSchema.optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(["createdAt", "months", "price"]).default("months"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const subscriptionRouter = createTRPCRouter({
  /**
   * Create a NOWPayments email subscription
   * NOWPayments sends payment link to user's email
   */
  createCryptoCheckout: protectedProcedure
    .input(
      z.object({
        billingCycle: billingCycleSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { billingCycle } = input;
      const userId = ctx.session.user.id;

      // Get user email
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user?.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User email is required for payment",
        });
      }

      // Check if user already has an active subscription
      const existingSubscription = await ctx.db.subscription.findUnique({
        where: { userId },
      });

      if (existingSubscription?.status === "active") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have an active subscription",
        });
      }

      // Get the active subscription plan from database
      const plan = await ctx.db.subscription_plan.findFirst({
        where: { billingCycle, isActive: true },
      });

      if (!plan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No active subscription plan found for ${billingCycle} billing cycle`,
        });
      }

      try {
        // Create email subscription via NOWPayments
        const subscription = await nowpaymentsService.createEmailSubscription({
          email: user.email,
          nowpaymentsPlanId: plan.nowpaymentsId,
        });

        // Create/update pending subscription record
        await ctx.db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            billingCycle,
            status: "pending",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(),
            nowpaymentsSubscriptionId: subscription.id,
            planId: plan.id,
          },
          update: {
            billingCycle,
            status: "pending",
            nowpaymentsSubscriptionId: subscription.id,
            planId: plan.id,
          },
        });

        return {
          success: true,
          message: "Payment link sent to your email",
          data: {
            subscriptionId: subscription.id,
            status: subscription.status,
          },
        };
      } catch (error) {
        console.error("NOWPayments checkout error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create subscription. Please try again.",
        });
      }
    }),

  /**
   * Legacy: Create a Coinremitter invoice for crypto payment
   */
  createCoinremitterCheckout: protectedProcedure
    .input(
      z.object({
        billingCycle: billingCycleSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { billingCycle } = input;
      const userId = ctx.session.user.id;

      // Get user email for Coinremitter invoice
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user?.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User email is required for payment",
        });
      }

      // Check if user already has an active subscription
      const existingSubscription = await ctx.db.subscription.findUnique({
        where: { userId },
      });

      if (existingSubscription?.status === "active") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have an active subscription",
        });
      }

      try {
        const invoice = await coinremitterService.createInvoice({
          userId,
          billingCycle,
          userEmail: user.email,
        });

        // Create pending subscription record
        await ctx.db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            billingCycle,
            status: "pending",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(),
            coinGateOrderId: invoice.invoice_id,
          },
          update: {
            billingCycle,
            status: "pending",
            coinGateOrderId: invoice.invoice_id,
          },
        });

        return {
          success: true,
          data: {
            paymentUrl: invoice.url,
            invoiceId: invoice.invoice_id,
          },
        };
      } catch (error) {
        console.error("Coinremitter checkout error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  /**
   * Get current subscription details for the logged-in user
   */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.db.subscription.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!subscription) {
      return {
        success: true,
        data: null,
      };
    }

    return {
      success: true,
      data: {
        id: subscription.id,
        billingCycle: subscription.billingCycle,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart.toISOString(),
        currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
        cancelledAt: subscription.cancelledAt?.toISOString() ?? null,
        daysRemaining: Math.max(
          0,
          Math.ceil(
            (subscription.currentPeriodEnd.getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          ),
        ),
      },
    };
  }),

  /**
   * Cancel subscription (will remain active until period end)
   */
  cancel: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await ctx.db.subscription.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No subscription found",
      });
    }

    if (subscription.status !== "active") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Subscription is not active",
      });
    }

    await subscriptionService.cancelSubscription(ctx.session.user.id);

    return {
      success: true,
      message:
        "Subscription cancelled. You will retain access until the end of your billing period.",
    };
  }),

  /**
   * Admin: Get all subscriptions with filters
   */
  getForDashboard: adminProcedure
    .input(getForDashboardSchema)
    .query(async ({ ctx, input }) => {
      const { page, limit, status, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      const where = status ? { status } : {};

      const [subscriptions, total] = await Promise.all([
        ctx.db.subscription.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        ctx.db.subscription.count({ where }),
      ]);

      return {
        success: true,
        data: {
          subscriptions: subscriptions.map((sub) => ({
            id: sub.id,
            user: sub.user,
            billingCycle: sub.billingCycle,
            status: sub.status,
            currentPeriodStart: sub.currentPeriodStart.toISOString(),
            currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
            cancelledAt: sub.cancelledAt?.toISOString() ?? null,
            invoiceId: sub.coinGateOrderId,
            createdAt: sub.createdAt.toISOString(),
          })),
          pagination: {
            page,
            total,
            totalPages: Math.ceil(total / limit),
            size: limit,
          },
        },
      };
    }),

  // ==================== TOKEN PURCHASE ENDPOINTS ====================

  /**
   * Get all available token packages
   */
  getTokenPackages: publicProcedure.query(() => {
    return {
      success: true,
      data: TOKEN_PACKAGES.map((pkg) => ({
        id: pkg.id,
        tokens: pkg.tokens,
        price: pkg.price,
        bonus: pkg.bonus,
      })),
    };
  }),

  /**
   * Create a NOWPayments invoice for token purchase
   * REQUIRES: Active subscription
   */
  createTokenCheckout: protectedProcedure
    .input(
      z.object({
        packageId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { packageId } = input;
      const userId = ctx.session.user.id;

      // CHECK: User must have active subscription to buy tokens
      const subscription = await ctx.db.subscription.findUnique({
        where: { userId },
      });

      if (!subscription || subscription.status !== "active") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Active subscription required to purchase tokens",
        });
      }

      // Validate package exists
      const tokenPackage = TOKEN_PACKAGES.find((pkg) => pkg.id === packageId);
      if (!tokenPackage) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token package",
        });
      }

      try {
        // Create NOWPayments one-time payment
        const payment = await nowpaymentsService.createTokenPayment({
          userId,
          packageId,
          amount: tokenPackage.price,
          description: `XChatLife ${tokenPackage.tokens} Tokens`,
        });

        return {
          success: true,
          data: {
            paymentUrl: payment.invoice_url,
            paymentId: payment.payment_id,
            tokens: tokenPackage.tokens,
            bonus: tokenPackage.bonus,
            price: tokenPackage.price,
          },
        };
      } catch (error) {
        console.error("NOWPayments token checkout error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  // ==================== SUBSCRIPTION PLAN ADMIN ENDPOINTS ====================

  /**
   * Get all subscription plans (public - for pricing page)
   */
  getPlans: publicProcedure.query(async ({ ctx }) => {
    const plans = await ctx.db.subscription_plan.findMany({
      where: { isActive: true },
      orderBy: { months: "asc" },
    });

    return {
      success: true,
      data: plans.map((plan) => ({
        id: plan.id,
        billingCycle: plan.billingCycle,
        label: plan.label,
        months: plan.months,
        price: Number(plan.price),
        pricePerMonth: Number(plan.pricePerMonth),
        tokensGranted: plan.tokensGranted,
        discount: plan.discount,
      })),
    };
  }),

  /**
   * Admin: Get all subscription plans including inactive with pagination and filters
   */
  getPlansAdmin: adminProcedure
    .input(getPlansAdminSchema)
    .query(async ({ ctx, input }) => {
      const { page, limit, billingCycle, isActive, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...(billingCycle && { billingCycle }),
        ...(isActive !== undefined && { isActive }),
      };

      const [plans, total] = await Promise.all([
        ctx.db.subscription_plan.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        ctx.db.subscription_plan.count({ where }),
      ]);

      return {
        success: true,
        data: {
          plans: plans.map((plan) => ({
            id: plan.id,
            nowpaymentsId: plan.nowpaymentsId,
            billingCycle: plan.billingCycle,
            label: plan.label,
            months: plan.months,
            price: Number(plan.price),
            pricePerMonth: Number(plan.pricePerMonth),
            tokensGranted: plan.tokensGranted,
            discount: plan.discount,
            isActive: plan.isActive,
            createdAt: plan.createdAt.toISOString(),
            updatedAt: plan.updatedAt.toISOString(),
          })),
          pagination: {
            page,
            total,
            totalPages: Math.ceil(total / limit),
            size: limit,
          },
        },
      };
    }),

  /**
   * Admin: Create a new subscription plan
   * Flow: 1) Create in NOWPayments -> 2) Save to DB with nowpaymentsId
   */
  createPlan: adminProcedure
    .input(
      z.object({
        billingCycle: billingCycleSchema,
        label: z.string().min(1).max(100),
        months: z.number().min(1),
        price: z.number().positive(),
        tokensGranted: z.number().min(0),
        discount: z.number().min(0).max(100).optional(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Calculate pricePerMonth
      const pricePerMonth = input.price / input.months;

      // Step 1: Create plan in NOWPayments first
      let nowpaymentsPlan;
      try {
        nowpaymentsPlan = await nowpaymentsService.createPlan({
          title: input.label,
          intervalDays: nowpaymentsService.monthsToIntervalDays(input.months),
          amount: input.price,
        });
      } catch (error) {
        console.error("[createPlan] NOWPayments error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Failed to create plan in payment provider. Please try again.",
        });
      }

      // Step 2: Save to local DB with NOWPayments ID
      try {
        const plan = await ctx.db.subscription_plan.create({
          data: {
            nowpaymentsId: nowpaymentsPlan.id,
            billingCycle: input.billingCycle,
            label: input.label,
            months: input.months,
            price: input.price,
            pricePerMonth,
            tokensGranted: input.tokensGranted,
            discount: input.discount,
            isActive: input.isActive,
          },
        });

        return {
          success: true,
          data: {
            id: plan.id,
            nowpaymentsId: plan.nowpaymentsId,
            billingCycle: plan.billingCycle,
            label: plan.label,
            months: plan.months,
            price: Number(plan.price),
            pricePerMonth: Number(plan.pricePerMonth),
            tokensGranted: plan.tokensGranted,
            discount: plan.discount,
            isActive: plan.isActive,
          },
        };
      } catch (dbError) {
        // Log orphaned NOWPayments plan for manual cleanup
        console.error(
          `[createPlan] DB error. Orphaned NOWPayments plan ID: ${nowpaymentsPlan.id}`,
          dbError,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Plan created in payment provider (ID: ${nowpaymentsPlan.id}) but failed to save locally. Contact support.`,
        });
      }
    }),

  /**
   * Admin: Update a subscription plan
   * Flow: If label/price changes -> Update NOWPayments first -> Then update DB
   */
  updatePlan: adminProcedure
    .input(
      z.object({
        id: z.string(),
        label: z.string().min(1).max(100).optional(),
        price: z.number().positive().optional(),
        tokensGranted: z.number().min(0).optional(),
        discount: z.number().min(0).max(100).nullable().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, label, price, ...restData } = input;

      // Get existing plan to check what's changing
      const existingPlan = await ctx.db.subscription_plan.findUnique({
        where: { id },
      });

      if (!existingPlan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription plan not found",
        });
      }

      // Check if label or price is changing (requires NOWPayments sync)
      const needsNowpaymentsSync =
        (label && label !== existingPlan.label) ||
        (price && price !== Number(existingPlan.price));

      // Step 1: Update NOWPayments if label or price changed
      if (needsNowpaymentsSync) {
        try {
          await nowpaymentsService.updatePlan(existingPlan.nowpaymentsId, {
            ...(label && label !== existingPlan.label && { title: label }),
            ...(price &&
              price !== Number(existingPlan.price) && { amount: price }),
          });
        } catch (error) {
          console.error("[updatePlan] NOWPayments error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Failed to update plan in payment provider. No changes made.",
          });
        }
      }

      // Step 2: Update local DB
      // Recalculate pricePerMonth if price changed
      const pricePerMonth = price ? price / existingPlan.months : undefined;

      const plan = await ctx.db.subscription_plan.update({
        where: { id },
        data: {
          ...(label && { label }),
          ...(price && { price }),
          ...(pricePerMonth && { pricePerMonth }),
          ...restData,
        },
      });

      return {
        success: true,
        data: {
          id: plan.id,
          nowpaymentsId: plan.nowpaymentsId,
          billingCycle: plan.billingCycle,
          label: plan.label,
          months: plan.months,
          price: Number(plan.price),
          pricePerMonth: Number(plan.pricePerMonth),
          tokensGranted: plan.tokensGranted,
          discount: plan.discount,
          isActive: plan.isActive,
        },
      };
    }),

  /**
   * Admin: Delete a subscription plan
   */
  deletePlan: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if any subscriptions are using this plan
      const subscriptionsCount = await ctx.db.subscription.count({
        where: { planId: input.id },
      });

      if (subscriptionsCount > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Cannot delete plan: ${subscriptionsCount} subscription(s) are using it. Deactivate instead.`,
        });
      }

      await ctx.db.subscription_plan.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
