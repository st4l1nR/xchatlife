import { z } from "zod";
import { TRPCError } from "@trpc/server";
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
          role: true,
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
          role: invitation.role,
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

      // Update invitation as used and update user role
      await ctx.db.$transaction([
        ctx.db.invitation.update({
          where: { id: invitation.id },
          data: { usedAt: new Date() },
        }),
        ctx.db.user.update({
          where: { id: input.userId },
          data: { role: invitation.role },
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
      });

      if (!invitation) {
        return {
          success: true,
          hadInvitation: false,
        };
      }

      // Update invitation as used and update user role
      await ctx.db.$transaction([
        ctx.db.invitation.update({
          where: { id: invitation.id },
          data: { usedAt: new Date() },
        }),
        ctx.db.user.update({
          where: { id: input.userId },
          data: { role: invitation.role },
        }),
      ]);

      return {
        success: true,
        hadInvitation: true,
        role: invitation.role,
      };
    }),
});
