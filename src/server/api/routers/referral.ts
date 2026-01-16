import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";

// Schema for dashboard query
const getForDashboardSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["pending", "converted", "paid"]).optional(),
  affiliateId: z.string().optional(),
  sortBy: z
    .enum(["createdAt", "convertedAt", "commission"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const referralRouter = createTRPCRouter({
  /**
   * Get all referrals for admin dashboard with pagination and filters
   */
  getForDashboard: adminProcedure
    .input(getForDashboardSchema)
    .query(async ({ ctx, input }) => {
      const { page, limit, search, status, affiliateId, sortBy, sortOrder } =
        input;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: {
        status?: "pending" | "converted" | "paid";
        affiliateId?: string;
        OR?: Array<{
          user?: {
            OR?: Array<{
              name?: { contains: string; mode: "insensitive" };
              email?: { contains: string; mode: "insensitive" };
            }>;
          };
          affiliate?: {
            OR?: Array<{
              firstName?: { contains: string; mode: "insensitive" };
              email?: { contains: string; mode: "insensitive" };
            }>;
          };
        }>;
      } = {};

      if (status) {
        where.status = status;
      }

      if (affiliateId) {
        where.affiliateId = affiliateId;
      }

      if (search) {
        where.OR = [
          {
            user: {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          },
          {
            affiliate: {
              OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        ];
      }

      // Get total count and referrals
      const [total, referrals] = await Promise.all([
        ctx.db.referral.count({ where }),
        ctx.db.referral.findMany({
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
          referrals: referrals.map((referral) => ({
            id: referral.id,
            referredUserName: referral.user.name ?? "Unknown",
            referredUserEmail: referral.user.email,
            referredUserAvatarSrc: referral.user.image,
            affiliateName: referral.affiliate.firstName ?? "Unknown",
            affiliateEmail: referral.affiliate.email,
            affiliateAvatarSrc: referral.affiliate.user.image,
            affiliateId: referral.affiliateId,
            status: referral.status,
            commission: Number(referral.commission),
            convertedAt: referral.convertedAt?.toISOString() ?? null,
            paidAt: referral.paidAt?.toISOString() ?? null,
            createdAt: referral.createdAt.toISOString(),
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
   * Get list of approved affiliates for filter dropdown
   */
  getApprovedAffiliates: adminProcedure.query(async ({ ctx }) => {
    const affiliates = await ctx.db.affiliate.findMany({
      where: {
        status: "approved",
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        email: true,
      },
      orderBy: { firstName: "asc" },
    });

    return {
      success: true,
      data: affiliates.map((affiliate) => ({
        id: affiliate.id,
        name: affiliate.firstName ?? affiliate.email,
        email: affiliate.email,
      })),
    };
  }),

  /**
   * Mark a referral as paid
   */
  markAsPaid: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Find the referral
      const referral = await ctx.db.referral.findUnique({
        where: { id },
        include: {
          affiliate: true,
        },
      });

      if (!referral) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Referral not found",
        });
      }

      if (referral.status !== "converted") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only converted referrals can be marked as paid",
        });
      }

      // Update referral status and affiliate total earned in a transaction
      const updatedReferral = await ctx.db.$transaction(async (tx) => {
        // Update the referral
        const updated = await tx.referral.update({
          where: { id },
          data: {
            status: "paid",
            paidAt: new Date(),
          },
        });

        // Update affiliate's total earned
        await tx.affiliate.update({
          where: { id: referral.affiliateId },
          data: {
            totalEarned: {
              increment: referral.commission,
            },
          },
        });

        return updated;
      });

      return {
        success: true,
        data: updatedReferral,
      };
    }),
});
