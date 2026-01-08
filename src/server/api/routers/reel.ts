import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

// Zod schemas for input validation
const reelCreateSchema = z.object({
  characterId: z.string(),
  videoId: z.string(),
  thumbnailId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

const reelUpdateSchema = z.object({
  id: z.string(),
  videoId: z.string().optional(),
  thumbnailId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const reelRouter = createTRPCRouter({
  /**
   * Get all active reels
   */
  getAll: publicProcedure.query(async ({ ctx }) => {
    const reels = await ctx.db.reel.findMany({
      where: {
        isActive: true,
        character: {
          isActive: true,
          isPublic: true,
        },
      },
      include: {
        video: true,
        thumbnail: true,
        character: {
          include: {
            poster: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reels.map((reel) => ({
      id: reel.id,
      title: reel.title,
      description: reel.description,
      videoSrc: reel.video.url,
      thumbnailSrc: reel.thumbnail?.url ?? reel.character.poster?.url,
      viewCount: reel.viewCount,
      character: {
        id: reel.character.id,
        name: reel.character.name,
        avatarSrc: reel.character.poster?.url,
      },
      createdAt: reel.createdAt,
    }));
  }),

  /**
   * Get reels with cursor-based pagination (for infinite scroll)
   */
  getInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const reels = await ctx.db.reel.findMany({
        take: limit + 1,
        where: {
          isActive: true,
          character: {
            isActive: true,
            isPublic: true,
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          video: true,
          thumbnail: true,
          character: {
            include: {
              poster: true,
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (reels.length > limit) {
        const nextItem = reels.pop();
        nextCursor = nextItem!.id;
      }

      const items = reels.map((reel) => ({
        id: reel.id,
        name: reel.character.name,
        avatarSrc: reel.character.poster?.url,
        videoSrc: reel.video.url,
        posterSrc: reel.thumbnail?.url ?? reel.character.poster?.url,
        likeCount: reel.viewCount,
        chatUrl: `/chat/${reel.character.id}`,
      }));

      return {
        items,
        nextCursor,
      };
    }),

  /**
   * Get reel by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const reel = await ctx.db.reel.findUnique({
        where: { id: input.id },
        include: {
          video: true,
          thumbnail: true,
          character: {
            include: {
              poster: true,
            },
          },
        },
      });

      if (!reel) {
        return null;
      }

      // Increment view count
      await ctx.db.reel.update({
        where: { id: input.id },
        data: { viewCount: { increment: 1 } },
      });

      return {
        id: reel.id,
        title: reel.title,
        description: reel.description,
        videoSrc: reel.video.url,
        thumbnailSrc: reel.thumbnail?.url ?? reel.character.poster?.url,
        viewCount: reel.viewCount + 1, // Include the just-incremented count
        character: {
          id: reel.character.id,
          name: reel.character.name,
          avatarSrc: reel.character.poster?.url,
        },
        createdAt: reel.createdAt,
      };
    }),

  /**
   * Get reels by character ID
   */
  getByCharacter: publicProcedure
    .input(z.object({ characterId: z.string() }))
    .query(async ({ ctx, input }) => {
      const reels = await ctx.db.reel.findMany({
        where: {
          characterId: input.characterId,
          isActive: true,
        },
        include: {
          video: true,
          thumbnail: true,
          character: {
            include: {
              poster: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return reels.map((reel) => ({
        id: reel.id,
        title: reel.title,
        description: reel.description,
        videoSrc: reel.video.url,
        thumbnailSrc: reel.thumbnail?.url ?? reel.character.poster?.url,
        viewCount: reel.viewCount,
        createdAt: reel.createdAt,
      }));
    }),

  /**
   * Create a new reel (admin only)
   */
  create: adminProcedure
    .input(reelCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const reel = await ctx.db.reel.create({
        data: input,
        include: {
          video: true,
          thumbnail: true,
          character: true,
        },
      });

      return reel;
    }),

  /**
   * Update a reel (admin only)
   */
  update: adminProcedure
    .input(reelUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const reel = await ctx.db.reel.update({
        where: { id },
        data: updateData,
        include: {
          video: true,
          thumbnail: true,
          character: true,
        },
      });

      return reel;
    }),

  /**
   * Delete a reel (admin only)
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const reel = await ctx.db.reel.delete({
        where: { id: input.id },
      });

      return reel;
    }),
});
