import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { nanoid } from "nanoid";
import { resend, EMAIL_FROM } from "@/server/email";
import AffiliateApprovalEmail from "@/app/_components/email/AffiliateApprovalEmail";

// Schema for submitting an affiliate application
const submitApplicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  websiteUrl: z.string().min(1, "Website URL is required").url("Invalid URL"),
  telegram: z.string().optional(),
  type: z.enum([
    "influencer",
    "blogger",
    "youtuber",
    "social_media",
    "website_owner",
    "email_marketing",
    "other",
  ]),
  introduction: z.string().optional(),
  promotionalMethods: z.string().optional(),
});

// Schema for dashboard query
const getForDashboardSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  type: z
    .enum([
      "influencer",
      "blogger",
      "youtuber",
      "social_media",
      "website_owner",
      "email_marketing",
      "other",
    ])
    .optional(),
  sortBy: z.enum(["createdAt", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const affiliateRouter = createTRPCRouter({
  /**
   * Submit an affiliate application (for logged-in users)
   */
  submitApplication: protectedProcedure
    .input(submitApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const userEmail = ctx.session.user.email;

      if (!userEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User email not found",
        });
      }

      // Check if user already has an affiliate application
      const existingAffiliate = await ctx.db.affiliate.findUnique({
        where: { userId },
      });

      if (existingAffiliate) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have an affiliate application",
        });
      }

      // Create the affiliate application
      const affiliate = await ctx.db.affiliate.create({
        data: {
          userId,
          email: userEmail,
          firstName: input.firstName,
          websiteUrl: input.websiteUrl,
          telegram: input.telegram,
          type: input.type,
          introduction: input.introduction,
          promotionalMethods: input.promotionalMethods,
          status: "pending",
        },
      });

      return {
        success: true,
        data: affiliate,
      };
    }),

  /**
   * Get affiliates for admin dashboard with pagination and filters
   */
  getForDashboard: adminProcedure
    .input(getForDashboardSchema)
    .query(async ({ ctx, input }) => {
      const { page, limit, search, status, type, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: {
        status?: "pending" | "approved" | "rejected";
        type?:
          | "influencer"
          | "blogger"
          | "youtuber"
          | "social_media"
          | "website_owner"
          | "email_marketing"
          | "other";
        OR?: Array<{
          firstName?: { contains: string; mode: "insensitive" };
          email?: { contains: string; mode: "insensitive" };
          websiteUrl?: { contains: string; mode: "insensitive" };
        }>;
      } = {};

      if (status) {
        where.status = status;
      }

      if (type) {
        where.type = type;
      }

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { websiteUrl: { contains: search, mode: "insensitive" } },
        ];
      }

      // Get total count and affiliates
      const [total, affiliates] = await Promise.all([
        ctx.db.affiliate.count({ where }),
        ctx.db.affiliate.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
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
          affiliates: affiliates.map((affiliate) => ({
            id: affiliate.id,
            name: affiliate.firstName ?? affiliate.user.name ?? "Unknown",
            email: affiliate.email,
            avatarSrc: affiliate.user.image,
            type: affiliate.type,
            websiteUrl: affiliate.websiteUrl,
            telegram: affiliate.telegram,
            introduction: affiliate.introduction,
            promotionalMethods: affiliate.promotionalMethods,
            status: affiliate.status,
            referralCode: affiliate.referralCode,
            commissionRate: affiliate.commissionRate
              ? Number(affiliate.commissionRate)
              : null,
            totalEarned: Number(affiliate.totalEarned),
            isActive: affiliate.isActive,
            createdAt: affiliate.createdAt.toISOString(),
            approvedAt: affiliate.approvedAt?.toISOString() ?? null,
            rejectionReason: affiliate.rejectionReason,
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
   * Approve an affiliate application
   */
  approve: adminProcedure
    .input(
      z.object({
        id: z.string(),
        commissionRate: z.number().min(0).max(100).default(40),
        referralCode: z.string().min(3).max(20).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, commissionRate, referralCode: customReferralCode } = input;

      // Find the affiliate
      const affiliate = await ctx.db.affiliate.findUnique({
        where: { id },
      });

      if (!affiliate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Affiliate not found",
        });
      }

      if (affiliate.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This application has already been processed",
        });
      }

      // Use custom referral code if provided, otherwise generate one
      const referralCode =
        customReferralCode?.toUpperCase() ?? nanoid(8).toUpperCase();

      // Check if referral code already exists
      if (customReferralCode) {
        const existingCode = await ctx.db.affiliate.findFirst({
          where: { referralCode: referralCode },
        });
        if (existingCode) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This referral code is already in use",
          });
        }
      }

      // Convert percentage to decimal (e.g., 40 -> 0.4)
      const commissionRateDecimal = commissionRate / 100;

      // Find the AFFILIATE role
      const affiliateRole = await ctx.db.role_custom.findFirst({
        where: { name: "AFFILIATE" },
      });

      // Update affiliate and assign role to user in a transaction
      const updatedAffiliate = await ctx.db.$transaction(async (tx) => {
        // Update the affiliate
        const updated = await tx.affiliate.update({
          where: { id },
          data: {
            status: "approved",
            referralCode,
            commissionRate: commissionRateDecimal,
            isActive: true,
            approvedAt: new Date(),
          },
        });

        // Assign AFFILIATE role to the user if role exists
        if (affiliateRole) {
          await tx.user.update({
            where: { id: affiliate.userId },
            data: { customRoleId: affiliateRole.id },
          });
        }

        return updated;
      });

      // Send approval email with referral code
      if (resend) {
        try {
          await resend.emails.send({
            from: EMAIL_FROM,
            to: affiliate.email,
            subject: "Your Affiliate Application Has Been Approved!",
            react: AffiliateApprovalEmail({
              referralCode,
              firstName: affiliate.firstName ?? undefined,
              commissionRate: commissionRateDecimal,
            }),
          });
        } catch (emailError) {
          // Log error but don't fail the approval
          console.error("Failed to send affiliate approval email:", emailError);
        }
      }

      return {
        success: true,
        data: updatedAffiliate,
      };
    }),

  /**
   * Reject an affiliate application
   */
  reject: adminProcedure
    .input(
      z.object({
        id: z.string(),
        reason: z.string().min(1, "Rejection reason is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, reason } = input;

      // Find the affiliate
      const affiliate = await ctx.db.affiliate.findUnique({
        where: { id },
      });

      if (!affiliate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Affiliate not found",
        });
      }

      if (affiliate.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This application has already been processed",
        });
      }

      // Update the affiliate
      const updatedAffiliate = await ctx.db.affiliate.update({
        where: { id },
        data: {
          status: "rejected",
          rejectionReason: reason,
        },
      });

      return {
        success: true,
        data: updatedAffiliate,
      };
    }),

  /**
   * Get referrals for a specific affiliate
   */
  getReferralsByAffiliateId: adminProcedure
    .input(
      z.object({
        affiliateId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        status: z.enum(["pending", "converted", "paid"]).optional(),
        sortBy: z
          .enum(["createdAt", "convertedAt", "commission"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { affiliateId, page, limit, status, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: {
        affiliateId: string;
        status?: "pending" | "converted" | "paid";
      } = { affiliateId };

      if (status) {
        where.status = status;
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
   * Get a single affiliate by ID (for viewing details)
   */
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const affiliate = await ctx.db.affiliate.findUnique({
        where: { id: input.id },
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
      });

      if (!affiliate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Affiliate not found",
        });
      }

      return {
        success: true,
        data: {
          id: affiliate.id,
          name: affiliate.firstName ?? affiliate.user.name ?? "Unknown",
          email: affiliate.email,
          avatarSrc: affiliate.user.image,
          type: affiliate.type,
          websiteUrl: affiliate.websiteUrl,
          telegram: affiliate.telegram,
          introduction: affiliate.introduction,
          promotionalMethods: affiliate.promotionalMethods,
          status: affiliate.status,
          referralCode: affiliate.referralCode,
          commissionRate: affiliate.commissionRate
            ? Number(affiliate.commissionRate)
            : null,
          totalEarned: Number(affiliate.totalEarned),
          isActive: affiliate.isActive,
          createdAt: affiliate.createdAt.toISOString(),
          approvedAt: affiliate.approvedAt?.toISOString() ?? null,
          rejectionReason: affiliate.rejectionReason,
        },
      };
    }),
});
