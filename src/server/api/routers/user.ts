import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.db.subscription.findUnique({
      where: { userId: ctx.session.user.id },
    });
    return { success: true, data: subscription };
  }),

  getUsageQuota: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const usage = await ctx.db.usageQuota.findFirst({
      where: {
        userId: ctx.session.user.id,
        periodStart: { lte: now },
        periodEnd: { gte: now },
      },
    });
    return { success: true, data: usage };
  }),
});
