import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { hashPassword } from "better-auth/crypto";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const invitationRouter = createTRPCRouter({
  /**
   * Validate an invitation token and return the invitation details
   * This is a public procedure since users need to validate before signing up
   */
  validate: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findUnique({
        where: { token: input.token },
        select: {
          id: true,
          email: true,
          roleId: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          usedAt: true,
          createdAt: true,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found or invalid",
        });
      }

      if (invitation.usedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This invitation has already been used",
        });
      }

      return {
        success: true,
        data: {
          email: invitation.email,
          roleId: invitation.roleId,
          roleName: invitation.role.name,
        },
      };
    }),

  /**
   * Mark an invitation as used after successful signup
   * This is called after the user has successfully created their account
   */
  markUsed: publicProcedure
    .input(
      z.object({
        token: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findUnique({
        where: { token: input.token },
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
          message: "This invitation has already been used",
        });
      }

      // Update invitation as used and update user customRoleId
      await ctx.db.$transaction([
        ctx.db.invitation.update({
          where: { id: invitation.id },
          data: { usedAt: new Date() },
        }),
        ctx.db.user.update({
          where: { id: input.userId },
          data: { customRoleId: invitation.roleId },
        }),
      ]);

      return {
        success: true,
        message: "Invitation marked as used and role assigned",
      };
    }),

  /**
   * Check if an email has a pending invitation and apply role if so
   * This is called after OAuth signup to check if the email was invited
   */
  checkAndApplyRole: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Find pending invitation for this email
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          email: input.email,
          usedAt: null,
        },
        include: {
          role: true,
        },
      });

      if (!invitation) {
        return {
          success: true,
          hadInvitation: false,
        };
      }

      // Update invitation as used and update user customRoleId
      await ctx.db.$transaction([
        ctx.db.invitation.update({
          where: { id: invitation.id },
          data: { usedAt: new Date() },
        }),
        ctx.db.user.update({
          where: { id: input.userId },
          data: { customRoleId: invitation.roleId },
        }),
      ]);

      return {
        success: true,
        hadInvitation: true,
        roleId: invitation.roleId,
        roleName: invitation.role.name,
      };
    }),

  /**
   * Accept an invitation by creating a user account with the provided password
   * This handles user creation, password hashing, account creation, and role assignment
   * all in a single transaction
   */
  acceptInvitation: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string().min(6, "Password must be at least 6 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Validate invitation exists and is not used
      const invitation = await ctx.db.invitation.findUnique({
        where: { token: input.token },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found or invalid",
        });
      }

      if (invitation.usedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This invitation has already been used",
        });
      }

      // 2. Check if email is already registered
      const existingUser = await ctx.db.user.findUnique({
        where: { email: invitation.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists",
        });
      }

      // 3. Hash the password using better-auth's internal hash function
      const hashedPassword = await hashPassword(input.password);

      // 4. Create user, account, and mark invitation as used in a transaction
      const user = await ctx.db.$transaction(async (tx) => {
        // Create user with customRoleId from the invitation
        const newUser = await tx.user.create({
          data: {
            email: invitation.email,
            name: invitation.email.split("@")[0] ?? "User",
            customRoleId: invitation.roleId,
            emailVerified: true, // Invited users are pre-verified
          },
        });

        // Create credential account for better-auth compatibility
        await tx.account.create({
          data: {
            userId: newUser.id,
            accountId: newUser.id,
            providerId: "credential",
            password: hashedPassword,
          },
        });

        // Mark invitation as used
        await tx.invitation.update({
          where: { id: invitation.id },
          data: { usedAt: new Date() },
        });

        return newUser;
      });

      return {
        success: true,
        userId: user.id,
        email: user.email,
      };
    }),
});
