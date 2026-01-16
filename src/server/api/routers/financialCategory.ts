import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
} from "@/server/api/trpc";

// Enum matching Prisma schema
const FinancialType = z.enum(["income", "expense"]);

// Input schemas
const createCategorySchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9_]+$/, "Name must be lowercase with underscores only"),
  label: z.string().min(1).max(100),
  type: FinancialType,
  group: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

const updateCategorySchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9_]+$/, "Name must be lowercase with underscores only")
    .optional(),
  label: z.string().min(1).max(100).optional(),
  type: FinancialType.optional(),
  group: z.string().min(1).max(50).optional(),
  description: z.string().max(500).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const financialCategoryRouter = createTRPCRouter({
  /**
   * Get all financial categories with pagination
   */
  getAll: adminProcedure
    .input(
      paginationSchema.extend({
        type: FinancialType.optional(),
        group: z.string().optional(),
        isActive: z.boolean().optional(),
        search: z.string().optional(),
        sortBy: z.enum(["name", "label", "sortOrder", "createdAt"]).default("sortOrder"),
        sortOrder: z.enum(["asc", "desc"]).default("asc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        page,
        limit,
        type,
        group,
        isActive,
        search,
        sortBy,
        sortOrder,
      } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...(type && { type }),
        ...(group && { group }),
        ...(isActive !== undefined && { isActive }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { label: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const [categories, totalCount] = await Promise.all([
        ctx.db.financial_category.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        ctx.db.financial_category.count({ where }),
      ]);

      return {
        success: true,
        data: {
          categories: categories.map((c) => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
          })),
          totalCount,
          page,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }),

  /**
   * Get a single category by ID
   */
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.financial_category.findUnique({
        where: { id: input.id },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return {
        success: true,
        data: {
          ...category,
          createdAt: category.createdAt.toISOString(),
        },
      };
    }),

  /**
   * Create a new financial category
   */
  create: adminProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      // Check if name already exists
      const existing = await ctx.db.financial_category.findUnique({
        where: { name: input.name },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A category with this name already exists",
        });
      }

      const category = await ctx.db.financial_category.create({
        data: {
          name: input.name,
          label: input.label,
          type: input.type,
          group: input.group,
          description: input.description,
          sortOrder: input.sortOrder,
          isActive: input.isActive,
        },
      });

      return {
        success: true,
        data: {
          ...category,
          createdAt: category.createdAt.toISOString(),
        },
      };
    }),

  /**
   * Update an existing financial category
   */
  update: adminProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Check if category exists
      const existing = await ctx.db.financial_category.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // If name is being changed, check for conflicts
      if (data.name && data.name !== existing.name) {
        const nameConflict = await ctx.db.financial_category.findUnique({
          where: { name: data.name },
        });

        if (nameConflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A category with this name already exists",
          });
        }
      }

      const category = await ctx.db.financial_category.update({
        where: { id },
        data,
      });

      return {
        success: true,
        data: {
          ...category,
          createdAt: category.createdAt.toISOString(),
        },
      };
    }),

  /**
   * Delete a financial category
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if category exists
      const existing = await ctx.db.financial_category.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { transactions: true },
          },
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Check if category has transactions
      if (existing._count.transactions > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Cannot delete category with ${existing._count.transactions} associated transactions. Deactivate it instead.`,
        });
      }

      await ctx.db.financial_category.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Get available groups (for dropdown)
   */
  getGroups: adminProcedure.query(async ({ ctx }) => {
    const groups = await ctx.db.financial_category.findMany({
      select: { group: true },
      distinct: ["group"],
      orderBy: { group: "asc" },
    });

    return {
      success: true,
      data: groups.map((g) => g.group),
    };
  }),
});
