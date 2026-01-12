import { z } from "zod";
import { CharacterGender, CharacterStyle } from "../../../../generated/prisma";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { fetchAndUploadToR2 } from "@/server/r2";

// Input schema matching frontend form with option IDs (directly from frontend)
const createCharacterSchema = z.object({
  characterType: z.enum(["girl", "men", "trans"]),
  style: z.enum(["realistic", "anime"]),
  // Option IDs (variant-specific)
  ethnicityId: z.string(),
  hairStyleId: z.string(),
  hairColorId: z.string(),
  eyeColorId: z.string(),
  bodyTypeId: z.string(),
  breastSizeId: z.string(),
  // Option IDs (universal)
  personalityId: z.string(),
  relationshipId: z.string(),
  occupationId: z.string(),
  kinkIds: z.array(z.string()).min(1).max(3),
  // Other fields
  age: z.number().min(18).max(55),
  name: z.string().min(2).max(20),
  voice: z.string(),
  // Media URLs (R2 URLs)
  posterUrl: z.string().url(),
  videoUrl: z.string().url(),
  // Visibility
  isPublic: z.boolean(),
});

export const characterRouter = createTRPCRouter({
  /**
   * Get all public active characters (non-paginated, for backward compatibility)
   */
  getAll: publicProcedure.query(async ({ ctx }) => {
    const characters = await ctx.db.character.findMany({
      where: {
        isPublic: true,
        isActive: true,
      },
      include: {
        poster: true,
        video: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return characters.map((character) => ({
      id: character.id,
      name: character.name,
      age: character.age,
      href: `/chat/${character.id}`,
      imageSrc: character.poster?.url ?? "/images/girl-poster.webp",
      videoSrc: character.video?.url,
      description: undefined,
      isNew:
        new Date().getTime() - character.createdAt.getTime() <
        7 * 24 * 60 * 60 * 1000, // 7 days
      isLive: character.isLive,
      playWithMeHref: character.isLive ? `/play/${character.id}` : undefined,
    }));
  }),

  /**
   * Get public active characters with cursor-based pagination (for infinite scroll)
   */
  getInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(16),
        cursor: z.string().nullish(),
        style: z.nativeEnum(CharacterStyle).optional(),
        gender: z.nativeEnum(CharacterGender).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, style, gender } = input;

      const characters = await ctx.db.character.findMany({
        take: limit + 1,
        where: {
          isPublic: true,
          isActive: true,
          isLive: false, // Exclude live characters (shown in separate section)
          ...(style && { style }),
          ...(gender && { gender }),
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          poster: true,
          video: true,
        },
      });

      let nextCursor: string | undefined = undefined;
      if (characters.length > limit) {
        const nextItem = characters.pop();
        nextCursor = nextItem!.id;
      }

      const items = characters.map((character) => ({
        id: character.id,
        name: character.name,
        age: character.age,
        href: `/chat/${character.id}`,
        imageSrc: character.poster?.url ?? "/images/girl-poster.webp",
        videoSrc: character.video?.url,
        description: undefined,
        isNew:
          new Date().getTime() - character.createdAt.getTime() <
          7 * 24 * 60 * 60 * 1000,
      }));

      return {
        items,
        nextCursor,
      };
    }),

  /**
   * Get live characters only
   */
  getLive: publicProcedure
    .input(
      z
        .object({
          style: z.nativeEnum(CharacterStyle).optional(),
          gender: z.nativeEnum(CharacterGender).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const characters = await ctx.db.character.findMany({
        where: {
          isPublic: true,
          isActive: true,
          isLive: true,
          ...(input?.style && { style: input.style }),
          ...(input?.gender && { gender: input.gender }),
        },
        include: {
          poster: true,
          video: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return characters.map((character) => ({
        id: character.id,
        name: character.name,
        age: character.age,
        href: `/chat/${character.id}`,
        imageSrc: character.poster?.url ?? "/images/girl-poster.webp",
        videoSrc: character.video?.url,
        isLive: true,
        playWithMeHref: `/play/${character.id}`,
      }));
    }),

  /**
   * Get character by ID with full details
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        include: {
          poster: true,
          video: true,
          ethnicity: true,
          personality: true,
          hairStyle: true,
          hairColor: true,
          eyeColor: true,
          bodyType: true,
          breastSize: true,
          occupation: true,
          relationship: true,
          character_kink: {
            include: {
              kink: true,
            },
          },
        },
      });

      if (!character) {
        return null;
      }

      return {
        ...character,
        kinks: character.character_kink.map((k) => k.kink),
      };
    }),

  /**
   * Create a new character
   * Accepts option IDs directly from frontend (no name lookup needed)
   */
  create: protectedProcedure
    .input(createCharacterSchema)
    .mutation(async ({ ctx, input }) => {
      console.log("[character.create] Input posterUrl:", input.posterUrl);
      console.log("[character.create] Input videoUrl:", input.videoUrl);

      // Fetch media from URLs and re-upload to R2 with unique keys
      // This avoids unique constraint violations on the Media.key field
      const [posterUpload, videoUpload] = await Promise.all([
        fetchAndUploadToR2(input.posterUrl, "characters", "poster"),
        fetchAndUploadToR2(input.videoUrl, "characters", "video"),
      ]);

      // Create media records and character in a transaction
      const character = await ctx.db.$transaction(async (tx) => {
        // Create poster media record
        const posterMedia = await tx.media.create({
          data: {
            type: "image",
            key: posterUpload.key,
            url: posterUpload.url,
            mimeType: posterUpload.mimeType,
            size: posterUpload.size,
          },
        });

        // Create video media record
        const videoMedia = await tx.media.create({
          data: {
            type: "video",
            key: videoUpload.key,
            url: videoUpload.url,
            mimeType: videoUpload.mimeType,
            size: videoUpload.size,
          },
        });

        // Create the character with media relations
        // IDs come directly from frontend - no lookup needed
        const newCharacter = await tx.character.create({
          data: {
            name: input.name,
            gender: input.characterType as CharacterGender,
            style: input.style as CharacterStyle,
            age: input.age,
            voice: input.voice,
            isPublic: input.isPublic,
            posterId: posterMedia.id,
            videoId: videoMedia.id,
            createdById: ctx.session.user.id,
            // Foreign keys to option tables (IDs from frontend)
            ethnicityId: input.ethnicityId,
            personalityId: input.personalityId,
            hairStyleId: input.hairStyleId,
            hairColorId: input.hairColorId,
            eyeColorId: input.eyeColorId,
            bodyTypeId: input.bodyTypeId,
            breastSizeId: input.breastSizeId,
            occupationId: input.occupationId,
            relationshipId: input.relationshipId,
            character_kink: {
              create: input.kinkIds.map((kinkId) => ({ kinkId })),
            },
          },
        });

        return newCharacter;
      });

      return { success: true, characterId: character.id };
    }),
});
