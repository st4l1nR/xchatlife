import { db } from "@/server/db";
import { tokenService } from "./tokenService";
import { coinremitterService, TOKEN_PACKAGES } from "./coinremitterService";

export const tokenPurchaseService = {
  /**
   * Process a token purchase after successful payment
   * Creates all necessary records in a single transaction
   * @param provider - "nowpayments" or "coinremitter"
   */
  async processTokenPurchase(
    userId: string,
    packageId: string,
    invoiceId: string,
    paymentAmount: number,
    provider: "nowpayments" | "coinremitter" = "nowpayments",
  ): Promise<void> {
    const tokenPackage = TOKEN_PACKAGES.find((pkg) => pkg.id === packageId);

    if (!tokenPackage) {
      throw new Error(`Invalid token package: ${packageId}`);
    }

    // Calculate total tokens including bonus
    const bonusTokens = tokenPackage.bonus
      ? Math.floor((tokenPackage.tokens * tokenPackage.bonus) / 100)
      : 0;
    const totalTokens = tokenPackage.tokens + bonusTokens;

    await db.$transaction(async (tx) => {
      // 1. Check if this invoice was already processed (idempotency)
      const existingTransaction = await tx.financial_transaction.findFirst({
        where: { externalId: invoiceId },
      });

      if (existingTransaction) {
        console.log("[TokenPurchase] Invoice already processed:", invoiceId);
        return;
      }

      // 2. Add tokens to user balance using tokenService
      await tokenService.addTokens(
        userId,
        totalTokens,
        "purchase",
        `Purchased ${tokenPackage.tokens} tokens${bonusTokens > 0 ? ` (+${bonusTokens} bonus)` : ""}`,
        { invoiceId, packageId, baseTokens: tokenPackage.tokens, bonusTokens },
        tx,
      );

      // 3. Get or create token purchase income category
      let category = await tx.financial_category.findFirst({
        where: { name: "token_purchase_income" },
      });

      if (!category) {
        category = await tx.financial_category.create({
          data: {
            name: "token_purchase_income",
            label: "Token Purchase Income",
            type: "income",
            group: "token_sales",
            description: "Income from token purchases",
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
          description: `Token purchase: ${tokenPackage.tokens} tokens${bonusTokens > 0 ? ` (+${bonusTokens} bonus)` : ""} via ${provider}`,
          userId,
          externalId: invoiceId,
          provider,
          metadata: {
            packageId,
            baseTokens: tokenPackage.tokens,
            bonusPercent: tokenPackage.bonus,
            bonusTokens,
            totalTokens,
            paymentMethod: "crypto",
          },
        },
      });
    });

    console.log(
      `[TokenPurchase] Successfully processed purchase for user ${userId}: ${totalTokens} tokens`,
    );
  },

  /**
   * Get token package details
   */
  getTokenPackage(packageId: string) {
    return coinremitterService.getTokenPackage(packageId);
  },

  /**
   * Get all available token packages
   */
  getAllPackages() {
    return coinremitterService.getTokenPackages();
  },
};
