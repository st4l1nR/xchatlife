import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "../../../../generated/prisma";

// Zod schema for financial type
const financialTypeSchema = z.enum(["income", "expense"]);

// Schema for creating a transaction
const createTransactionSchema = z.object({
  categoryId: z.string().cuid(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3).default("USD"),
  description: z.string().min(1, "Description is required").max(500),
  userId: z.string().cuid().optional(),
  affiliateId: z.string().cuid().optional(),
  referralId: z.string().cuid().optional(),
  unitType: z.enum(["message", "image", "video", "audio"]).optional(),
  unitCount: z.number().int().positive().optional(),
  unitCost: z.number().positive().optional(),
  externalId: z.string().max(255).optional(),
  provider: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
  notes: z.string().max(1000).optional(),
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
});

// Schema for updating a transaction
const updateTransactionSchema = z.object({
  id: z.string().cuid(),
  categoryId: z.string().cuid().optional(),
  amount: z.number().positive("Amount must be positive").optional(),
  currency: z.string().length(3).optional(),
  description: z.string().min(1).max(500).optional(),
  userId: z.string().cuid().nullable().optional(),
  affiliateId: z.string().cuid().nullable().optional(),
  referralId: z.string().cuid().nullable().optional(),
  unitType: z
    .enum(["message", "image", "video", "audio"])
    .nullable()
    .optional(),
  unitCount: z.number().int().positive().nullable().optional(),
  unitCost: z.number().positive().nullable().optional(),
  externalId: z.string().max(255).nullable().optional(),
  provider: z.string().max(100).nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  periodStart: z.string().datetime().nullable().optional(),
  periodEnd: z.string().datetime().nullable().optional(),
});

// Schema for dashboard query
const getForDashboardSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  type: financialTypeSchema.optional(),
  categoryId: z.string().cuid().optional(),
  provider: z.string().optional(),
  userId: z.string().cuid().optional(),
  affiliateId: z.string().cuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(["createdAt", "amount", "description"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const financialTransactionRouter = createTRPCRouter({
  /**
   * Get all transactions for admin dashboard with pagination and filters
   */
  getForDashboard: adminProcedure
    .input(getForDashboardSchema)
    .query(async ({ ctx, input }) => {
      const {
        page,
        limit,
        search,
        type,
        categoryId,
        provider,
        userId,
        affiliateId,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder,
      } = input;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: {
        type?: "income" | "expense";
        categoryId?: string;
        provider?: string;
        userId?: string;
        affiliateId?: string;
        createdAt?: { gte?: Date; lte?: Date };
        OR?: Array<{
          description?: { contains: string; mode: "insensitive" };
          notes?: { contains: string; mode: "insensitive" };
          externalId?: { contains: string; mode: "insensitive" };
        }>;
      } = {};

      if (type) {
        where.type = type;
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (provider) {
        where.provider = provider;
      }

      if (userId) {
        where.userId = userId;
      }

      if (affiliateId) {
        where.affiliateId = affiliateId;
      }

      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) {
          where.createdAt.gte = new Date(dateFrom);
        }
        if (dateTo) {
          where.createdAt.lte = new Date(dateTo);
        }
      }

      if (search) {
        where.OR = [
          { description: { contains: search, mode: "insensitive" } },
          { notes: { contains: search, mode: "insensitive" } },
          { externalId: { contains: search, mode: "insensitive" } },
        ];
      }

      // Get total count and transactions
      const [total, transactions] = await Promise.all([
        ctx.db.financial_transaction.count({ where }),
        ctx.db.financial_transaction.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                label: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            affiliate: {
              select: {
                id: true,
                firstName: true,
                email: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
      ]);

      const totalPage = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          transactions: transactions.map((transaction) => ({
            id: transaction.id,
            categoryId: transaction.categoryId,
            categoryLabel: transaction.category.label,
            categoryName: transaction.category.name,
            type: transaction.type,
            amount: transaction.amount.toString(),
            currency: transaction.currency,
            description: transaction.description,
            provider: transaction.provider,
            unitType: transaction.unitType,
            unitCount: transaction.unitCount,
            unitCost: transaction.unitCost?.toString() ?? null,
            userName: transaction.user?.name ?? null,
            userEmail: transaction.user?.email ?? null,
            affiliateName: transaction.affiliate?.firstName ?? null,
            affiliateEmail: transaction.affiliate?.email ?? null,
            externalId: transaction.externalId,
            notes: transaction.notes,
            periodStart: transaction.periodStart?.toISOString() ?? null,
            periodEnd: transaction.periodEnd?.toISOString() ?? null,
            createdAt: transaction.createdAt.toISOString(),
          })),
          pagination: {
            page,
            total,
            totalPage,
            size: limit,
          },
        },
      };
    }),

  /**
   * Get unique providers for filter dropdown
   */
  getProviders: adminProcedure.query(async ({ ctx }) => {
    const transactions = await ctx.db.financial_transaction.findMany({
      select: { provider: true },
      distinct: ["provider"],
      where: { provider: { not: null } },
      orderBy: { provider: "asc" },
    });

    return {
      success: true,
      data: transactions.map((t) => t.provider).filter(Boolean) as string[],
    };
  }),

  /**
   * Get a single transaction by ID
   */
  getById: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const transaction = await ctx.db.financial_transaction.findUnique({
        where: { id: input.id },
        include: {
          category: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          affiliate: {
            select: {
              id: true,
              firstName: true,
              email: true,
              user: {
                select: {
                  image: true,
                },
              },
            },
          },
          referral: {
            select: {
              id: true,
              status: true,
              commission: true,
            },
          },
        },
      });

      if (!transaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found",
        });
      }

      return {
        success: true,
        data: {
          id: transaction.id,
          category: {
            id: transaction.category.id,
            name: transaction.category.name,
            label: transaction.category.label,
            type: transaction.category.type,
            group: transaction.category.group,
          },
          type: transaction.type,
          amount: transaction.amount.toString(),
          currency: transaction.currency,
          description: transaction.description,
          user: transaction.user
            ? {
                id: transaction.user.id,
                name: transaction.user.name,
                email: transaction.user.email,
                avatarSrc: transaction.user.image,
              }
            : null,
          affiliate: transaction.affiliate
            ? {
                id: transaction.affiliate.id,
                name: transaction.affiliate.firstName,
                email: transaction.affiliate.email,
                avatarSrc: transaction.affiliate.user.image,
              }
            : null,
          referral: transaction.referral
            ? {
                id: transaction.referral.id,
                status: transaction.referral.status,
                commission: transaction.referral.commission.toString(),
              }
            : null,
          unitType: transaction.unitType,
          unitCount: transaction.unitCount,
          unitCost: transaction.unitCost?.toString() ?? null,
          externalId: transaction.externalId,
          provider: transaction.provider,
          metadata: transaction.metadata,
          notes: transaction.notes,
          periodStart: transaction.periodStart?.toISOString() ?? null,
          periodEnd: transaction.periodEnd?.toISOString() ?? null,
          createdAt: transaction.createdAt.toISOString(),
          createdBy: transaction.createdBy,
        },
      };
    }),

  /**
   * Create a new transaction
   */
  create: adminProcedure
    .input(createTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify category exists and get its type
      const category = await ctx.db.financial_category.findUnique({
        where: { id: input.categoryId },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Verify user if provided
      if (input.userId) {
        const user = await ctx.db.user.findUnique({
          where: { id: input.userId },
        });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
      }

      // Verify affiliate if provided
      if (input.affiliateId) {
        const affiliate = await ctx.db.affiliate.findUnique({
          where: { id: input.affiliateId },
        });
        if (!affiliate) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Affiliate not found",
          });
        }
      }

      // Verify referral if provided
      if (input.referralId) {
        const referral = await ctx.db.referral.findUnique({
          where: { id: input.referralId },
        });
        if (!referral) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Referral not found",
          });
        }
      }

      const transaction = await ctx.db.financial_transaction.create({
        data: {
          categoryId: input.categoryId,
          type: category.type, // Inherit type from category
          amount: input.amount,
          currency: input.currency,
          description: input.description,
          userId: input.userId,
          affiliateId: input.affiliateId,
          referralId: input.referralId,
          unitType: input.unitType,
          unitCount: input.unitCount,
          unitCost: input.unitCost,
          externalId: input.externalId,
          provider: input.provider,
          metadata: input.metadata as Prisma.InputJsonValue | undefined,
          notes: input.notes,
          periodStart: input.periodStart
            ? new Date(input.periodStart)
            : undefined,
          periodEnd: input.periodEnd ? new Date(input.periodEnd) : undefined,
          createdBy: ctx.session.user.id,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              label: true,
            },
          },
        },
      });

      return {
        success: true,
        data: {
          id: transaction.id,
          categoryId: transaction.categoryId,
          categoryLabel: transaction.category.label,
          type: transaction.type,
          amount: transaction.amount.toString(),
          currency: transaction.currency,
          description: transaction.description,
          createdAt: transaction.createdAt.toISOString(),
        },
      };
    }),

  /**
   * Update an existing transaction
   */
  update: adminProcedure
    .input(updateTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Check if transaction exists
      const existingTransaction = await ctx.db.financial_transaction.findUnique(
        {
          where: { id },
        },
      );

      if (!existingTransaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found",
        });
      }

      // If categoryId is being updated, get the new category's type
      let newType = existingTransaction.type;
      if (updateData.categoryId) {
        const category = await ctx.db.financial_category.findUnique({
          where: { id: updateData.categoryId },
        });
        if (!category) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }
        newType = category.type;
      }

      // Build update data
      const dataToUpdate: Prisma.financial_transactionUpdateInput = {
        type: newType,
      };

      if (updateData.categoryId !== undefined) {
        dataToUpdate.category = { connect: { id: updateData.categoryId } };
      }
      if (updateData.amount !== undefined) {
        dataToUpdate.amount = updateData.amount;
      }
      if (updateData.currency !== undefined) {
        dataToUpdate.currency = updateData.currency;
      }
      if (updateData.description !== undefined) {
        dataToUpdate.description = updateData.description;
      }
      if (updateData.userId !== undefined) {
        dataToUpdate.user = updateData.userId
          ? { connect: { id: updateData.userId } }
          : { disconnect: true };
      }
      if (updateData.affiliateId !== undefined) {
        dataToUpdate.affiliate = updateData.affiliateId
          ? { connect: { id: updateData.affiliateId } }
          : { disconnect: true };
      }
      if (updateData.referralId !== undefined) {
        dataToUpdate.referral = updateData.referralId
          ? { connect: { id: updateData.referralId } }
          : { disconnect: true };
      }
      if (updateData.unitType !== undefined) {
        dataToUpdate.unitType = updateData.unitType;
      }
      if (updateData.unitCount !== undefined) {
        dataToUpdate.unitCount = updateData.unitCount;
      }
      if (updateData.unitCost !== undefined) {
        dataToUpdate.unitCost = updateData.unitCost;
      }
      if (updateData.externalId !== undefined) {
        dataToUpdate.externalId = updateData.externalId;
      }
      if (updateData.provider !== undefined) {
        dataToUpdate.provider = updateData.provider;
      }
      if (updateData.metadata !== undefined) {
        dataToUpdate.metadata = updateData.metadata
          ? (updateData.metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull;
      }
      if (updateData.notes !== undefined) {
        dataToUpdate.notes = updateData.notes;
      }
      if (updateData.periodStart !== undefined) {
        dataToUpdate.periodStart = updateData.periodStart
          ? new Date(updateData.periodStart)
          : null;
      }
      if (updateData.periodEnd !== undefined) {
        dataToUpdate.periodEnd = updateData.periodEnd
          ? new Date(updateData.periodEnd)
          : null;
      }

      const transaction = await ctx.db.financial_transaction.update({
        where: { id },
        data: dataToUpdate,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              label: true,
            },
          },
        },
      });

      return {
        success: true,
        data: {
          id: transaction.id,
          categoryId: transaction.categoryId,
          categoryLabel: transaction.category.label,
          type: transaction.type,
          amount: transaction.amount.toString(),
          currency: transaction.currency,
          description: transaction.description,
          createdAt: transaction.createdAt.toISOString(),
        },
      };
    }),

  /**
   * Delete a transaction
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check if transaction exists
      const existingTransaction = await ctx.db.financial_transaction.findUnique(
        {
          where: { id: input.id },
        },
      );

      if (!existingTransaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found",
        });
      }

      await ctx.db.financial_transaction.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        message: "Transaction deleted successfully",
      };
    }),

  /**
   * Get summary statistics
   */
  getSummary: adminProcedure
    .input(
      z
        .object({
          dateFrom: z.string().datetime().optional(),
          dateTo: z.string().datetime().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: { createdAt?: { gte?: Date; lte?: Date } } = {};

      if (input?.dateFrom || input?.dateTo) {
        where.createdAt = {};
        if (input?.dateFrom) {
          where.createdAt.gte = new Date(input.dateFrom);
        }
        if (input?.dateTo) {
          where.createdAt.lte = new Date(input.dateTo);
        }
      }

      const [incomeResult, expenseResult, transactionCount] = await Promise.all(
        [
          ctx.db.financial_transaction.aggregate({
            where: { ...where, type: "income" },
            _sum: { amount: true },
            _count: true,
          }),
          ctx.db.financial_transaction.aggregate({
            where: { ...where, type: "expense" },
            _sum: { amount: true },
            _count: true,
          }),
          ctx.db.financial_transaction.count({ where }),
        ],
      );

      const totalIncome = Number(incomeResult._sum.amount ?? 0);
      const totalExpense = Number(expenseResult._sum.amount ?? 0);
      const netBalance = totalIncome - totalExpense;

      return {
        success: true,
        data: {
          totalIncome: totalIncome.toFixed(2),
          totalExpense: totalExpense.toFixed(2),
          netBalance: netBalance.toFixed(2),
          incomeCount: incomeResult._count,
          expenseCount: expenseResult._count,
          transactionCount,
        },
      };
    }),
});
