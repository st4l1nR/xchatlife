import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

// Valid gender and style names (matching database option tables)
const VALID_GENDERS = ["girl", "men", "trans"] as const;
const VALID_STYLES = ["realistic", "anime"] as const;

// Zod schemas for input validation
const storyCreateSchema = z.object({
  characterId: z.string(),
  mediaId: z.string(),
  thumbnailId: z.string().optional(),
  expiresInHours: z.number().min(1).max(168).default(24), // Default 24 hours, max 1 week
});

const storyUpdateSchema = z.object({
  id: z.string(),
  mediaId: z.string().optional(),
  thumbnailId: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Helper to format relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }
}

export const storyRouter = createTRPCRouter({
  /**
   * Get all active stories (grouped by character)
   * Returns stories that haven't expired and are active
   */
  getAll: publicProcedure
    .input(
      z
        .object({
          style: z.enum(VALID_STYLES).optional(),
          gender: z.enum(VALID_GENDERS).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();

      // Get all active stories that haven't expired
      const stories = await ctx.db.story.findMany({
        where: {
          isActive: true,
          expiresAt: {
            gt: now,
          },
          character: {
            isActive: true,
            isPublic: true,
            ...(input?.style && { style: { name: input.style } }),
            ...(input?.gender && { gender: { name: input.gender } }),
          },
        },
        include: {
          media: true,
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

      // Group stories by character
      const groupedByCharacter = stories.reduce(
        (acc, story) => {
          const characterId = story.characterId;
          if (!acc[characterId]) {
            acc[characterId] = {
              character: story.character,
              stories: [],
            };
          }
          acc[characterId].stories.push(story);
          return acc;
        },
        {} as Record<
          string,
          {
            character: (typeof stories)[0]["character"];
            stories: typeof stories;
          }
        >,
      );

      // Transform to StoryProfile format
      return Object.values(groupedByCharacter).map(
        ({ character, stories }) => ({
          id: character.id,
          name: character.name,
          avatarSrc: character.poster?.url ?? "/images/girl-poster.webp",
          timestamp: getRelativeTime(stories[0]!.createdAt),
          media: stories.map((story) => ({
            id: story.id,
            type: story.media.type as "image" | "video",
            src: story.media.url,
            duration:
              story.media.type === "image"
                ? 5
                : (story.media.duration ?? undefined),
          })),
        }),
      );
    }),

  /**
   * Get story by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const story = await ctx.db.story.findUnique({
        where: { id: input.id },
        include: {
          media: true,
          thumbnail: true,
          character: {
            include: {
              poster: true,
            },
          },
        },
      });

      return story;
    }),

  /**
   * Get stories by character ID
   */
  getByCharacter: publicProcedure
    .input(z.object({ characterId: z.string() }))
    .query(async ({ ctx, input }) => {
      const now = new Date();

      const stories = await ctx.db.story.findMany({
        where: {
          characterId: input.characterId,
          isActive: true,
          expiresAt: {
            gt: now,
          },
        },
        include: {
          media: true,
          thumbnail: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return stories;
    }),

  /**
   * Create a new story (admin only)
   */
  create: adminProcedure
    .input(storyCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const { expiresInHours, ...storyData } = input;

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiresInHours);

      const story = await ctx.db.story.create({
        data: {
          ...storyData,
          expiresAt,
        },
        include: {
          media: true,
          thumbnail: true,
          character: true,
        },
      });

      return story;
    }),

  /**
   * Update a story (admin only)
   */
  update: adminProcedure
    .input(storyUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const story = await ctx.db.story.update({
        where: { id },
        data: updateData,
        include: {
          media: true,
          thumbnail: true,
          character: true,
        },
      });

      return story;
    }),

  /**
   * Delete a story (admin only)
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const story = await ctx.db.story.delete({
        where: { id: input.id },
      });

      return story;
    }),
});
