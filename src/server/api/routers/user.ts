import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { tokenService } from "@/server/services/tokenService";

export const userRouter = createTRPCRouter({
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.db.subscription.findUnique({
      where: { userId: ctx.session.user.id },
    });
    return { success: true, data: subscription };
  }),

  getTokenBalance: protectedProcedure.query(async ({ ctx }) => {
    const tokenBalance = await tokenService.getBalance(ctx.session.user.id);
    return { success: true, data: { tokenBalance } };
  }),

  getTokenTransactions: protectedProcedure.query(async ({ ctx }) => {
    const transactions = await tokenService.getTransactionHistory(
      ctx.session.user.id,
    );
    return { success: true, data: transactions };
  }),
});
