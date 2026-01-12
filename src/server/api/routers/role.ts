import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

// Zod schema for permission value (CRUD order)
const permissionValueSchema = z.object({
  create: z.boolean(),
  read: z.boolean(),
  update: z.boolean(),
  delete: z.boolean(),
});

// Zod schema for all permissions
const permissionsSchema = z.object({
  user: permissionValueSchema,
  character: permissionValueSchema,
  chat: permissionValueSchema,
  media: permissionValueSchema,
  content: permissionValueSchema,
  visual_novel: permissionValueSchema,
  ticket: permissionValueSchema,
  subscription: permissionValueSchema,
  affiliate: permissionValueSchema,
  auth: permissionValueSchema,
});

// Input schema for creating a role
const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(50, "Role name must be 50 characters or less"),
  permissions: permissionsSchema,
});

// Input schema for updating a role
const updateRoleSchema = z.object({
  id: z.string().cuid(),
  name: z
    .string()
    .min(1, "Role name is required")
    .max(50, "Role name must be 50 characters or less"),
  permissions: permissionsSchema,
});

export const roleRouter = createTRPCRouter({
  /**
   * Get all roles
   */
  getAll: adminProcedure.query(async ({ ctx }) => {
    const roles = await ctx.db.role_custom.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        users: {
          take: 4,
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: { users: true },
        },
      },
    });

    return {
      success: true,
      data: roles.map((role) => ({
        id: role.id,
        name: role.name,
        permissions: role.permissions as z.infer<typeof permissionsSchema>,
        userCount: role._count.users,
        users: role.users.map((user) => ({
          id: user.id,
          name: user.name,
          avatarSrc: user.image ?? undefined,
        })),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      })),
    };
  }),

  /**
   * Get a single role by ID
   */
  getById: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const role = await ctx.db.role_custom.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { users: true },
          },
        },
      });

      if (!role) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      return {
        success: true,
        data: {
          id: role.id,
          name: role.name,
          permissions: role.permissions as z.infer<typeof permissionsSchema>,
          userCount: role._count.users,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        },
      };
    }),

  /**
   * Create a new role
   */
  create: adminProcedure
    .input(createRoleSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if role with this name already exists
      const existingRole = await ctx.db.role_custom.findUnique({
        where: { name: input.name },
      });

      if (existingRole) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A role with this name already exists",
        });
      }

      const role = await ctx.db.role_custom.create({
        data: {
          name: input.name,
          permissions: input.permissions,
        },
      });

      return {
        success: true,
        data: {
          id: role.id,
          name: role.name,
          permissions: role.permissions as z.infer<typeof permissionsSchema>,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        },
      };
    }),

  /**
   * Update an existing role
   */
  update: adminProcedure
    .input(updateRoleSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if role exists
      const existingRole = await ctx.db.role_custom.findUnique({
        where: { id: input.id },
      });

      if (!existingRole) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      // Check if another role with the new name exists
      if (input.name !== existingRole.name) {
        const nameConflict = await ctx.db.role_custom.findUnique({
          where: { name: input.name },
        });

        if (nameConflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A role with this name already exists",
          });
        }
      }

      const role = await ctx.db.role_custom.update({
        where: { id: input.id },
        data: {
          name: input.name,
          permissions: input.permissions,
        },
      });

      return {
        success: true,
        data: {
          id: role.id,
          name: role.name,
          permissions: role.permissions as z.infer<typeof permissionsSchema>,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        },
      };
    }),

  /**
   * Delete a role
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check if role exists
      const existingRole = await ctx.db.role_custom.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { users: true },
          },
        },
      });

      if (!existingRole) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      // Prevent deletion if users are assigned to this role
      if (existingRole._count.users > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Cannot delete role: ${existingRole._count.users} user(s) are still assigned to this role`,
        });
      }

      await ctx.db.role_custom.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        message: "Role deleted successfully",
      };
    }),
});
