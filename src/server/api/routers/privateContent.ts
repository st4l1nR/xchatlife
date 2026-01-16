import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";
import { fetchAndUploadToR2 } from "@/server/r2";

// Zod schemas for input validation
const privateContentCreateSchema = z.object({
  characterId: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  tokenPrice: z.number().min(0).default(0),
  posterUrl: z.string().url().optional(),
  mediaUrls: z
    .array(
      z.object({
        url: z.string().url(),
        mediaType: z.enum(["image", "video"]),
      }),
    )
    .min(1, "At least one media item is required"),
});

const privateContentUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  tokenPrice: z.number().min(0).optional(),
  posterUrl: z.string().url().optional(),
  mediaUrls: z
    .array(
      z.object({
        url: z.string().url(),
        mediaType: z.enum(["image", "video"]),
      }),
    )
    .optional(),
  isActive: z.boolean().optional(),
});

export const privateContentRouter = createTRPCRouter({
  /**
   * Get all private content for a character
   */
  getByCharacter: publicProcedure
    .input(z.object({ characterId: z.string() }))
    .query(async ({ ctx, input }) => {
      const privateContents = await ctx.db.private_content.findMany({
        where: {
          characterId: input.characterId,
          isActive: true,
        },
        include: {
          poster: true,
          mediaItems: {
            include: {
              media: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

      return privateContents.map((pc) => ({
        id: pc.id,
        name: pc.name,
        description: pc.description,
        tokenPrice: pc.tokenPrice,
        posterUrl: pc.poster?.url,
        media: pc.mediaItems.map((mi) => ({
          id: mi.id,
          url: mi.media.url,
          mediaType: mi.media.type,
        })),
        sortOrder: pc.sortOrder,
        createdAt: pc.createdAt,
      }));
    }),

  /**
   * Get private content by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const privateContent = await ctx.db.private_content.findUnique({
        where: { id: input.id },
        include: {
          poster: true,
          mediaItems: {
            include: {
              media: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
          character: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!privateContent) {
        return null;
      }

      return {
        id: privateContent.id,
        name: privateContent.name,
        description: privateContent.description,
        tokenPrice: privateContent.tokenPrice,
        posterUrl: privateContent.poster?.url,
        media: privateContent.mediaItems.map((mi) => ({
          id: mi.id,
          url: mi.media.url,
          mediaType: mi.media.type,
        })),
        character: privateContent.character,
        sortOrder: privateContent.sortOrder,
        createdAt: privateContent.createdAt,
      };
    }),

  /**
   * Create a new private content (admin only)
   */
  create: adminProcedure
    .input(privateContentCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        characterId,
        name,
        description,
        tokenPrice,
        posterUrl,
        mediaUrls,
      } = input;

      // Upload poster if provided
      let posterId: string | null = null;
      if (posterUrl) {
        const posterFolder = `private-content/${characterId}`;
        const posterResult = await fetchAndUploadToR2(
          posterUrl,
          posterFolder,
          "poster",
        );
        const posterMedia = await ctx.db.media.create({
          data: {
            type: "image",
            key: posterResult.key,
            url: posterResult.url,
          },
        });
        posterId = posterMedia.id;
      }

      // Get next sort order
      const lastContent = await ctx.db.private_content.findFirst({
        where: { characterId },
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });
      const nextSortOrder = (lastContent?.sortOrder ?? -1) + 1;

      // Create private content
      const privateContent = await ctx.db.private_content.create({
        data: {
          characterId,
          name,
          description,
          tokenPrice,
          posterId,
          sortOrder: nextSortOrder,
        },
      });

      // Upload and create media items
      for (let i = 0; i < mediaUrls.length; i++) {
        const mediaItem = mediaUrls[i]!;
        const mediaFolder = `private-content/${characterId}/${privateContent.id}`;
        const mediaType = mediaItem.mediaType === "video" ? "video" : "poster";
        const mediaResult = await fetchAndUploadToR2(
          mediaItem.url,
          mediaFolder,
          mediaType,
        );

        const media = await ctx.db.media.create({
          data: {
            type: mediaItem.mediaType,
            key: mediaResult.key,
            url: mediaResult.url,
          },
        });

        await ctx.db.private_content_media.create({
          data: {
            privateContentId: privateContent.id,
            mediaId: media.id,
            sortOrder: i,
          },
        });
      }

      return {
        success: true,
        data: { id: privateContent.id },
      };
    }),

  /**
   * Update a private content (admin only)
   */
  update: adminProcedure
    .input(privateContentUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        name,
        description,
        tokenPrice,
        posterUrl,
        mediaUrls,
        isActive,
      } = input;

      // Get existing content
      const existing = await ctx.db.private_content.findUnique({
        where: { id },
        include: { mediaItems: true },
      });

      if (!existing) {
        throw new Error("Private content not found");
      }

      // Handle poster update
      let posterId = existing.posterId;
      if (posterUrl !== undefined) {
        const posterFolder = `private-content/${existing.characterId}`;
        const posterResult = await fetchAndUploadToR2(
          posterUrl,
          posterFolder,
          "poster",
        );
        const posterMedia = await ctx.db.media.create({
          data: {
            type: "image",
            key: posterResult.key,
            url: posterResult.url,
          },
        });
        posterId = posterMedia.id;
      }

      // Update private content
      const privateContent = await ctx.db.private_content.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(tokenPrice !== undefined && { tokenPrice }),
          ...(posterId !== undefined && { posterId }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      // Handle media update if provided
      if (mediaUrls !== undefined) {
        // Delete existing media items
        await ctx.db.private_content_media.deleteMany({
          where: { privateContentId: id },
        });

        // Create new media items
        for (let i = 0; i < mediaUrls.length; i++) {
          const mediaItem = mediaUrls[i]!;
          const mediaFolder = `private-content/${existing.characterId}/${id}`;
          const mediaType =
            mediaItem.mediaType === "video" ? "video" : "poster";
          const mediaResult = await fetchAndUploadToR2(
            mediaItem.url,
            mediaFolder,
            mediaType,
          );

          const media = await ctx.db.media.create({
            data: {
              type: mediaItem.mediaType,
              key: mediaResult.key,
              url: mediaResult.url,
            },
          });

          await ctx.db.private_content_media.create({
            data: {
              privateContentId: id,
              mediaId: media.id,
              sortOrder: i,
            },
          });
        }
      }

      return {
        success: true,
        data: { id: privateContent.id },
      };
    }),

  /**
   * Delete a private content (admin only)
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete private content (cascade will delete media items)
      await ctx.db.private_content.delete({
        where: { id: input.id },
      });

      return {
        success: true,
      };
    }),

  /**
   * Reorder private content (admin only)
   */
  reorder: adminProcedure
    .input(
      z.object({
        characterId: z.string(),
        order: z.array(
          z.object({
            id: z.string(),
            sortOrder: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { order } = input;

      await ctx.db.$transaction(
        order.map((item) =>
          ctx.db.private_content.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );

      return {
        success: true,
      };
    }),
});
