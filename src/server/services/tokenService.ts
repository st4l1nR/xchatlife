import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import type { TokenTransactionType, Prisma } from "../../../generated/prisma";

type TransactionClient = Prisma.TransactionClient;

export const tokenService = {
  /**
   * Deduct tokens from a user's balance
   * @param userId - The user's ID
   * @param amount - The positive amount to deduct
   * @param transactionType - The type of transaction
   * @param description - Optional description for the transaction
   * @param metadata - Optional JSON metadata
   * @param tx - Optional transaction client for use within existing transactions
   */
  async deductTokens(
    userId: string,
    amount: number,
    transactionType: TokenTransactionType,
    description?: string,
    metadata?: Prisma.InputJsonValue,
    tx?: TransactionClient,
  ) {
    const client = tx ?? db;

    const executeDeduction = async (prisma: TransactionClient | typeof db) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { tokenBalance: true },
      });

      if (user.tokenBalance < amount) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient tokens",
        });
      }

      const newBalance = user.tokenBalance - amount;

      await prisma.user.update({
        where: { id: userId },
        data: { tokenBalance: newBalance },
      });

      await prisma.token_transaction.create({
        data: {
          userId,
          amount: -amount,
          transactionType,
          description,
          balanceAfter: newBalance,
          metadata,
        },
      });

      return newBalance;
    };

    // If we're already in a transaction, use the provided client directly
    if (tx) {
      return executeDeduction(tx);
    }

    // Otherwise, wrap in a new transaction
    return db.$transaction(async (prisma) => {
      return executeDeduction(prisma);
    });
  },

  /**
   * Add tokens to a user's balance
   * @param userId - The user's ID
   * @param amount - The positive amount to add
   * @param transactionType - The type of transaction
   * @param description - Optional description for the transaction
   * @param metadata - Optional JSON metadata
   * @param tx - Optional transaction client for use within existing transactions
   */
  async addTokens(
    userId: string,
    amount: number,
    transactionType: TokenTransactionType,
    description?: string,
    metadata?: Prisma.InputJsonValue,
    tx?: TransactionClient,
  ) {
    const client = tx ?? db;

    const executeAddition = async (prisma: TransactionClient | typeof db) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { tokenBalance: true },
      });

      const newBalance = user.tokenBalance + amount;

      await prisma.user.update({
        where: { id: userId },
        data: { tokenBalance: newBalance },
      });

      await prisma.token_transaction.create({
        data: {
          userId,
          amount: amount,
          transactionType,
          description,
          balanceAfter: newBalance,
          metadata,
        },
      });

      return newBalance;
    };

    // If we're already in a transaction, use the provided client directly
    if (tx) {
      return executeAddition(tx);
    }

    // Otherwise, wrap in a new transaction
    return db.$transaction(async (prisma) => {
      return executeAddition(prisma);
    });
  },

  /**
   * Get a user's current token balance
   */
  async getBalance(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { tokenBalance: true },
    });
    return user?.tokenBalance ?? 0;
  },

  /**
   * Get a user's transaction history
   */
  async getTransactionHistory(userId: string, limit = 50) {
    return db.token_transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  /**
   * Check if user has enough tokens for an operation
   */
  async hasEnoughTokens(userId: string, requiredAmount: number) {
    const balance = await this.getBalance(userId);
    return balance >= requiredAmount;
  },
};
