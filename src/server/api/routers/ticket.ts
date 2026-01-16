import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  permissionProcedure,
} from "@/server/api/trpc";
import { resend, EMAIL_FROM } from "@/server/email";
import TicketConfirmationEmail from "@/app/_components/email/TicketConfirmationEmail";

// Enums matching Prisma schema
const TicketStatus = z.enum(["open", "in_progress", "resolved", "closed"]);
const TicketPriority = z.enum(["low", "normal", "high", "urgent"]);
const TicketCategory = z.enum([
  "billing",
  "technical",
  "account",
  "content",
  "other",
]);
// Activity type enum (defined for reference, Prisma enum used directly)
const _TicketActivityType = z.enum([
  "note",
  "status_change",
  "priority_change",
  "assigned",
  "created",
]);

// Input schemas
const createTicketSchema = z.object({
  subject: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  category: TicketCategory,
  priority: TicketPriority.optional().default("normal"),
});

const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const ticketRouter = createTRPCRouter({
  // ============================================
  // User endpoints
  // ============================================

  /**
   * Create a new support ticket
   */
  create: protectedProcedure
    .input(createTicketSchema)
    .mutation(async ({ ctx, input }) => {
      // Get user info for the email
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { email: true, name: true },
      });

      const ticket = await ctx.db.ticket.create({
        data: {
          userId: ctx.session.user.id,
          subject: input.subject,
          description: input.description,
          category: input.category,
          priority: input.priority,
        },
      });

      // Create "created" activity
      await ctx.db.ticket_activity.create({
        data: {
          ticketId: ticket.id,
          userId: ctx.session.user.id,
          type: "created",
          content: `Ticket created with priority ${input.priority ?? "normal"} in category ${input.category}`,
        },
      });

      // Send confirmation email to the user
      if (resend && user?.email) {
        try {
          await resend.emails.send({
            from: EMAIL_FROM,
            to: user.email,
            subject: `We've received your support ticket - ${input.subject}`,
            react: TicketConfirmationEmail({
              ticketId: ticket.id,
              subject: input.subject,
              category: input.category,
              priority: input.priority ?? "normal",
              userName: user.name ?? undefined,
            }),
          });
        } catch (emailError) {
          // Log error but don't fail the ticket creation
          console.error(
            "Failed to send ticket confirmation email:",
            emailError,
          );
        }
      }

      return { success: true, data: ticket };
    }),

  /**
   * Get tickets created by the authenticated user
   */
  getMyTickets: protectedProcedure
    .input(
      paginationSchema.extend({
        status: TicketStatus.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, status } = input;
      const skip = (page - 1) * limit;

      const where = {
        userId: ctx.session.user.id,
        ...(status && { status }),
      };

      const [tickets, totalCount] = await Promise.all([
        ctx.db.ticket.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            assignedTo: {
              select: { id: true, name: true, image: true },
            },
            _count: {
              select: { replies: true },
            },
          },
        }),
        ctx.db.ticket.count({ where }),
      ]);

      return {
        success: true,
        data: {
          tickets: tickets.map((t) => ({
            ...t,
            replyCount: t._count.replies,
            _count: undefined,
          })),
          totalCount,
          page,
        },
      };
    }),

  /**
   * Get a ticket by ID (user can only see their own tickets)
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
          assignedTo: {
            select: { id: true, name: true, email: true, image: true },
          },
          replies: {
            orderBy: { createdAt: "asc" },
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
          activities: {
            orderBy: { createdAt: "desc" },
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
        },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      // Check if user owns the ticket or has read permission
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          customRole: { select: { name: true, permissions: true } },
        },
      });

      const roleName = user?.customRole?.name?.toUpperCase();
      const isAdmin = roleName === "ADMIN" || roleName === "SUPERADMIN";
      const permissions = user?.customRole?.permissions as Record<
        string,
        Record<string, boolean>
      > | null;
      const hasReadPermission = permissions?.ticket?.read === true;

      if (
        ticket.userId !== ctx.session.user.id &&
        !isAdmin &&
        !hasReadPermission
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view your own tickets",
        });
      }

      return { success: true, data: ticket };
    }),

  /**
   * Add a reply to a ticket
   */
  addReply: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        content: z.string().min(1).max(5000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if ticket exists and user has access
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.ticketId },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      // Check permissions
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          customRole: { select: { name: true, permissions: true } },
        },
      });

      const roleName = user?.customRole?.name?.toUpperCase();
      const isAdmin = roleName === "ADMIN" || roleName === "SUPERADMIN";
      const permissions = user?.customRole?.permissions as Record<
        string,
        Record<string, boolean>
      > | null;
      const hasUpdatePermission = permissions?.ticket?.update === true;

      if (
        ticket.userId !== ctx.session.user.id &&
        !isAdmin &&
        !hasUpdatePermission
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only reply to your own tickets",
        });
      }

      // Check if ticket is closed
      if (ticket.status === "closed") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot reply to a closed ticket",
        });
      }

      const reply = await ctx.db.ticket_reply.create({
        data: {
          ticketId: input.ticketId,
          userId: ctx.session.user.id,
          content: input.content,
        },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      });

      return { success: true, data: reply };
    }),

  /**
   * Close a ticket (user can only close their own tickets)
   */
  close: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.id },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      if (ticket.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only close your own tickets",
        });
      }

      if (ticket.status === "closed") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ticket is already closed",
        });
      }

      const updatedTicket = await ctx.db.ticket.update({
        where: { id: input.id },
        data: {
          status: "closed",
          resolvedAt: new Date(),
        },
      });

      return { success: true, data: updatedTicket };
    }),

  // ============================================
  // Admin/Support endpoints
  // ============================================

  /**
   * Get all tickets with filtering and pagination (requires ticket:read permission)
   */
  getAll: permissionProcedure("ticket", "read")
    .input(
      paginationSchema.extend({
        status: TicketStatus.optional(),
        priority: TicketPriority.optional(),
        category: TicketCategory.optional(),
        assignedToId: z.string().nullable().optional(),
        search: z.string().optional(),
        sortBy: z
          .enum(["createdAt", "updatedAt", "priority"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        page,
        limit,
        status,
        priority,
        category,
        assignedToId,
        search,
        sortBy,
        sortOrder,
      } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(category && { category }),
        // Handle assignedToId: null means unassigned, string means specific user
        ...(assignedToId !== undefined && {
          assignedToId: assignedToId === null ? null : assignedToId,
        }),
        ...(search && {
          OR: [
            { subject: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      // Custom sorting for priority
      const orderBy =
        sortBy === "priority"
          ? { priority: sortOrder }
          : { [sortBy]: sortOrder };

      const [tickets, totalCount] = await Promise.all([
        ctx.db.ticket.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
            assignedTo: {
              select: { id: true, name: true, image: true },
            },
            _count: {
              select: { replies: true },
            },
          },
        }),
        ctx.db.ticket.count({ where }),
      ]);

      return {
        success: true,
        data: {
          tickets: tickets.map((t) => ({
            ...t,
            replyCount: t._count.replies,
            _count: undefined,
          })),
          totalCount,
          page,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }),

  /**
   * Assign a ticket to a support agent (requires ticket:update permission)
   * If assignedToId is null, assigns to the current user
   */
  assign: permissionProcedure("ticket", "update")
    .input(
      z.object({
        ticketId: z.string(),
        assignedToId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.ticketId },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      // Use provided assignedToId or default to current user
      const targetAssigneeId = input.assignedToId ?? ctx.session.user.id;

      // Verify the assignee exists
      const assignee = await ctx.db.user.findUnique({
        where: { id: targetAssigneeId },
      });

      if (!assignee) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignee not found",
        });
      }

      const updatedTicket = await ctx.db.ticket.update({
        where: { id: input.ticketId },
        data: {
          assignedToId: targetAssigneeId,
          // Automatically set to in_progress when assigned
          ...(ticket.status === "open" && { status: "in_progress" }),
        },
        include: {
          assignedTo: {
            select: { id: true, name: true, image: true },
          },
        },
      });

      // Create "assigned" activity
      await ctx.db.ticket_activity.create({
        data: {
          ticketId: input.ticketId,
          userId: ctx.session.user.id,
          type: "assigned",
          content: `Ticket assigned to ${assignee.name}`,
          metadata: {
            assignedToId: targetAssigneeId,
            assignedToName: assignee.name,
            previousAssigneeId: ticket.assignedToId ?? null,
          },
        },
      });

      // If status changed to in_progress, create status_change activity too
      if (ticket.status === "open") {
        await ctx.db.ticket_activity.create({
          data: {
            ticketId: input.ticketId,
            userId: ctx.session.user.id,
            type: "status_change",
            content: "Status changed from open to in_progress",
            metadata: {
              oldStatus: "open",
              newStatus: "in_progress",
            },
          },
        });
      }

      return { success: true, data: updatedTicket };
    }),

  /**
   * Update ticket status (requires ticket:update permission)
   */
  updateStatus: permissionProcedure("ticket", "update")
    .input(
      z.object({
        ticketId: z.string(),
        status: TicketStatus,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.ticketId },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      const oldStatus = ticket.status;

      const updatedTicket = await ctx.db.ticket.update({
        where: { id: input.ticketId },
        data: {
          status: input.status,
          // Set resolvedAt when marking as resolved or closed
          ...(["resolved", "closed"].includes(input.status) &&
            !ticket.resolvedAt && { resolvedAt: new Date() }),
          // Clear resolvedAt when reopening
          ...(["open", "in_progress"].includes(input.status) && {
            resolvedAt: null,
          }),
        },
      });

      // Create "status_change" activity
      await ctx.db.ticket_activity.create({
        data: {
          ticketId: input.ticketId,
          userId: ctx.session.user.id,
          type: "status_change",
          content: `Status changed from ${oldStatus} to ${input.status}`,
          metadata: {
            oldStatus,
            newStatus: input.status,
          },
        },
      });

      return { success: true, data: updatedTicket };
    }),

  /**
   * Update ticket priority (requires ticket:update permission)
   */
  updatePriority: permissionProcedure("ticket", "update")
    .input(
      z.object({
        ticketId: z.string(),
        priority: TicketPriority,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.ticketId },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      const oldPriority = ticket.priority;

      const updatedTicket = await ctx.db.ticket.update({
        where: { id: input.ticketId },
        data: { priority: input.priority },
      });

      // Create "priority_change" activity
      await ctx.db.ticket_activity.create({
        data: {
          ticketId: input.ticketId,
          userId: ctx.session.user.id,
          type: "priority_change",
          content: `Priority changed from ${oldPriority} to ${input.priority}`,
          metadata: {
            oldPriority,
            newPriority: input.priority,
          },
        },
      });

      return { success: true, data: updatedTicket };
    }),

  /**
   * Get ticket statistics (requires ticket:read permission)
   */
  getStats: permissionProcedure("ticket", "read").query(async ({ ctx }) => {
    const [
      total,
      openCount,
      inProgressCount,
      resolvedCount,
      closedCount,
      lowCount,
      normalCount,
      highCount,
      urgentCount,
      billingCount,
      technicalCount,
      accountCount,
      contentCount,
      otherCount,
      resolvedTickets,
    ] = await Promise.all([
      ctx.db.ticket.count(),
      ctx.db.ticket.count({ where: { status: "open" } }),
      ctx.db.ticket.count({ where: { status: "in_progress" } }),
      ctx.db.ticket.count({ where: { status: "resolved" } }),
      ctx.db.ticket.count({ where: { status: "closed" } }),
      ctx.db.ticket.count({ where: { priority: "low" } }),
      ctx.db.ticket.count({ where: { priority: "normal" } }),
      ctx.db.ticket.count({ where: { priority: "high" } }),
      ctx.db.ticket.count({ where: { priority: "urgent" } }),
      ctx.db.ticket.count({ where: { category: "billing" } }),
      ctx.db.ticket.count({ where: { category: "technical" } }),
      ctx.db.ticket.count({ where: { category: "account" } }),
      ctx.db.ticket.count({ where: { category: "content" } }),
      ctx.db.ticket.count({ where: { category: "other" } }),
      // Get resolved tickets for avg resolution time
      ctx.db.ticket.findMany({
        where: {
          resolvedAt: { not: null },
        },
        select: {
          createdAt: true,
          resolvedAt: true,
        },
      }),
    ]);

    // Calculate average resolution time in hours
    let avgResolutionTime = 0;
    if (resolvedTickets.length > 0) {
      const totalHours = resolvedTickets.reduce((sum, t) => {
        if (t.resolvedAt) {
          const diff = t.resolvedAt.getTime() - t.createdAt.getTime();
          return sum + diff / (1000 * 60 * 60); // Convert to hours
        }
        return sum;
      }, 0);
      avgResolutionTime =
        Math.round((totalHours / resolvedTickets.length) * 10) / 10;
    }

    return {
      success: true,
      data: {
        total,
        byStatus: {
          open: openCount,
          in_progress: inProgressCount,
          resolved: resolvedCount,
          closed: closedCount,
        },
        byPriority: {
          low: lowCount,
          normal: normalCount,
          high: highCount,
          urgent: urgentCount,
        },
        byCategory: {
          billing: billingCount,
          technical: technicalCount,
          account: accountCount,
          content: contentCount,
          other: otherCount,
        },
        avgResolutionTime,
      },
    };
  }),

  /**
   * Get tickets assigned to the current user (requires ticket:read permission)
   */
  getAssignedToMe: permissionProcedure("ticket", "read")
    .input(
      paginationSchema.extend({
        status: TicketStatus.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, status } = input;
      const skip = (page - 1) * limit;

      const where = {
        assignedToId: ctx.session.user.id,
        ...(status && { status }),
      };

      const [tickets, totalCount] = await Promise.all([
        ctx.db.ticket.findMany({
          where,
          skip,
          take: limit,
          orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
            _count: {
              select: { replies: true },
            },
          },
        }),
        ctx.db.ticket.count({ where }),
      ]);

      return {
        success: true,
        data: {
          tickets: tickets.map((t) => ({
            ...t,
            replyCount: t._count.replies,
            _count: undefined,
          })),
          totalCount,
          page,
        },
      };
    }),

  // ============================================
  // Shared endpoints
  // ============================================

  /**
   * Get users that can be assigned to tickets (requires ticket:update permission)
   * Returns users with ticket permissions or admin/superadmin roles
   */
  getAssignableUsers: permissionProcedure("ticket", "update")
    .input(
      z.object({
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;

      // Get all roles that have ticket:update permission or are admin/superadmin
      const rolesWithPermission = await ctx.db.role_custom.findMany({
        where: {
          OR: [
            {
              name: {
                in: [
                  "admin",
                  "superadmin",
                  "Admin",
                  "Superadmin",
                  "ADMIN",
                  "SUPERADMIN",
                ],
              },
            },
            // We'll filter by permissions in JS since Prisma can't query JSON deeply
          ],
        },
        select: { id: true, name: true, permissions: true },
      });

      // Filter roles that have ticket:update permission
      const validRoleIds = rolesWithPermission
        .filter((role) => {
          const roleName = role.name.toUpperCase();
          if (roleName === "ADMIN" || roleName === "SUPERADMIN") return true;
          const permissions = role.permissions as Record<
            string,
            Record<string, boolean>
          > | null;
          return permissions?.ticket?.update === true;
        })
        .map((role) => role.id);

      // Get users with these roles
      const users = await ctx.db.user.findMany({
        where: {
          customRoleId: { in: validRoleIds },
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          customRole: {
            select: { name: true },
          },
        },
        orderBy: { name: "asc" },
        take: 50,
      });

      return {
        success: true,
        data: users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          roleName: user.customRole?.name ?? null,
        })),
      };
    }),

  /**
   * Get replies for a ticket
   */
  getReplies: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { ticketId, page, limit } = input;
      const skip = (page - 1) * limit;

      // Check if ticket exists and user has access
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      // Check permissions
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          customRole: { select: { name: true, permissions: true } },
        },
      });

      const roleName = user?.customRole?.name?.toUpperCase();
      const isAdmin = roleName === "ADMIN" || roleName === "SUPERADMIN";
      const permissions = user?.customRole?.permissions as Record<
        string,
        Record<string, boolean>
      > | null;
      const hasReadPermission = permissions?.ticket?.read === true;

      if (
        ticket.userId !== ctx.session.user.id &&
        !isAdmin &&
        !hasReadPermission
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view replies for your own tickets",
        });
      }

      const [replies, totalCount] = await Promise.all([
        ctx.db.ticket_reply.findMany({
          where: { ticketId },
          skip,
          take: limit,
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        }),
        ctx.db.ticket_reply.count({ where: { ticketId } }),
      ]);

      return {
        success: true,
        data: {
          replies,
          totalCount,
          page,
        },
      };
    }),

  /**
   * Get activities for a ticket (requires ticket:read permission)
   */
  getActivities: permissionProcedure("ticket", "read")
    .input(
      z.object({
        ticketId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { ticketId, page, limit } = input;
      const skip = (page - 1) * limit;

      const ticket = await ctx.db.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      const [activities, totalCount] = await Promise.all([
        ctx.db.ticket_activity.findMany({
          where: { ticketId },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        }),
        ctx.db.ticket_activity.count({ where: { ticketId } }),
      ]);

      return {
        success: true,
        data: {
          activities,
          totalCount,
          page,
        },
      };
    }),

  /**
   * Add a note/activity to a ticket (requires ticket:update permission)
   * Only ADMIN/SUPERADMIN can add manual notes
   */
  addActivity: permissionProcedure("ticket", "update")
    .input(
      z.object({
        ticketId: z.string(),
        content: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.ticketId },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      const activity = await ctx.db.ticket_activity.create({
        data: {
          ticketId: input.ticketId,
          userId: ctx.session.user.id,
          type: "note",
          content: input.content,
        },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      });

      return { success: true, data: activity };
    }),
});
