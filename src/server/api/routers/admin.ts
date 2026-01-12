import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { resend, EMAIL_FROM } from "@/server/email";
import InvitationEmail from "@/app/_components/email/InvitationEmail";
import { env } from "@/env";

const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["default", "admin", "superadmin"]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const adminRouter = createTRPCRouter({
  /**
   * Invite a new user by email with a specified role
   */
  inviteUser: adminProcedure
    .input(inviteUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, role, firstName, lastName } = input;

      // Check if user already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user with this email already exists",
        });
      }

      // Check if there's already a pending invitation for this email
      const existingInvitation = await ctx.db.invitation.findFirst({
        where: {
          email,
          usedAt: null,
        },
      });

      if (existingInvitation) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "An invitation has already been sent to this email. You can resend it if needed.",
        });
      }

      // Generate unique token
      const token = crypto.randomUUID();

      // Create invitation record
      const invitation = await ctx.db.invitation.create({
        data: {
          email,
          role,
          token,
          createdBy: ctx.session.user.id,
        },
      });

      // Get creator's name for email
      const creator = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { name: true },
      });

      // Build invitation link
      const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const inviteLink = `${appUrl}/?invite=${token}`;

      // Send invitation email
      if (resend) {
        try {
          await resend.emails.send({
            from: EMAIL_FROM,
            to: email,
            subject: "You've been invited to join XChatLife",
            react: InvitationEmail({
              inviteLink,
              email,
              role,
              invitedBy: creator?.name ?? undefined,
            }),
          });
        } catch (error) {
          // Delete invitation if email fails
          await ctx.db.invitation.delete({
            where: { id: invitation.id },
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send invitation email",
          });
        }
      }

      return {
        success: true,
        data: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          inviteLink: resend ? undefined : inviteLink, // Only return link if email not sent (dev mode)
        },
      };
    }),

  /**
   * Get all pending invitations
   */
  getInvitations: adminProcedure.query(async ({ ctx }) => {
    const invitations = await ctx.db.invitation.findMany({
      where: {
        usedAt: null,
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: invitations,
    };
  }),

  /**
   * Revoke (delete) a pending invitation
   */
  revokeInvitation: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findUnique({
        where: { id: input.id },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        });
      }

      if (invitation.usedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot revoke an invitation that has already been used",
        });
      }

      await ctx.db.invitation.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        message: "Invitation revoked successfully",
      };
    }),

  /**
   * Resend an invitation email
   */
  resendInvitation: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findUnique({
        where: { id: input.id },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        });
      }

      if (invitation.usedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot resend an invitation that has already been used",
        });
      }

      // Get creator's name for email
      const creator = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { name: true },
      });

      // Build invitation link
      const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const inviteLink = `${appUrl}/?invite=${invitation.token}`;

      // Send invitation email
      if (resend) {
        try {
          await resend.emails.send({
            from: EMAIL_FROM,
            to: invitation.email,
            subject: "You've been invited to join XChatLife",
            react: InvitationEmail({
              inviteLink,
              email: invitation.email,
              role: invitation.role,
              invitedBy: creator?.name ?? undefined,
            }),
          });
        } catch {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to resend invitation email",
          });
        }
      }

      return {
        success: true,
        message: "Invitation email resent successfully",
        inviteLink: resend ? undefined : inviteLink,
      };
    }),

  /**
   * Get a single user by ID (for user detail page)
   */
  getUserById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          language: true,
          tokenBalance: true,
          createdAt: true,
          customRole: {
            select: {
              id: true,
              name: true,
            },
          },
          subscription: {
            select: {
              id: true,
              billingCycle: true,
              status: true,
            },
          },
          _count: {
            select: {
              character: true,
              chat: true,
              visual_novel: true,
              collection: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Fetch recent token transactions for activity timeline
      const recentTransactions = await ctx.db.token_transaction.findMany({
        where: { userId: input.id },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          transactionType: true,
          amount: true,
          description: true,
          createdAt: true,
        },
      });

      return {
        success: true,
        data: {
          user,
          activities: recentTransactions,
        },
      };
    }),

  /**
   * Get all users (for user management)
   */
  getUsers: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        search: z.string().optional(),
        customRoleId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, customRoleId } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        ...(customRoleId && { customRoleId }),
      };

      const [users, total] = await Promise.all([
        ctx.db.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
            emailVerified: true,
            customRole: {
              select: {
                id: true,
                name: true,
              },
            },
            subscription: {
              select: {
                id: true,
                billingCycle: true,
                status: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        ctx.db.user.count({ where }),
      ]);

      return {
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    }),

  /**
   * Update a user's role
   */
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["default", "admin", "superadmin"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, role } = input;

      // Prevent changing own role
      if (userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot change your own role",
        });
      }

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Check if current user is superadmin when promoting to superadmin
      const currentUser = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { role: true },
      });

      if (role === "superadmin" && currentUser?.role !== "superadmin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only super admins can promote users to super admin",
        });
      }

      await ctx.db.user.update({
        where: { id: userId },
        data: { role },
      });

      return {
        success: true,
        message: "User role updated successfully",
      };
    }),

  /**
   * Delete a user
   */
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;

      // Prevent self-deletion
      if (userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot delete your own account",
        });
      }

      // Check if user exists
      const existingUser = await ctx.db.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Delete the user
      await ctx.db.user.delete({
        where: { id: userId },
      });

      return {
        success: true,
        message: "User deleted successfully",
      };
    }),
});
