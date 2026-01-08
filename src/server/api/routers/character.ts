import { z } from "zod";
import {
  CharacterGender,
  CharacterStyle,
  Ethnicity,
  HairStyle,
  HairColor,
  EyeColor,
  BodyType,
  BreastSize,
  Personality,
  Relationship,
  Occupation,
  Kink,
} from "../../../../generated/prisma";
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

// Zod schemas for input validation
const characterCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(18).max(99),
  gender: z.nativeEnum(CharacterGender),
  style: z.nativeEnum(CharacterStyle),
  ethnicity: z.nativeEnum(Ethnicity),
  hairStyle: z.nativeEnum(HairStyle),
  hairColor: z.nativeEnum(HairColor),
  eyeColor: z.nativeEnum(EyeColor),
  bodyType: z.nativeEnum(BodyType),
  breastSize: z.nativeEnum(BreastSize),
  personality: z.nativeEnum(Personality),
  relationship: z.nativeEnum(Relationship),
  occupation: z.nativeEnum(Occupation),
  voice: z.string().min(1, "Voice is required"),
  posterId: z.string().optional(),
  videoId: z.string().optional(),
  kinks: z.array(z.nativeEnum(Kink)).optional(),
  isPublic: z.boolean().default(true),
  isLive: z.boolean().default(false),
});

const characterUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  age: z.number().min(18).max(99).optional(),
  gender: z.nativeEnum(CharacterGender).optional(),
  style: z.nativeEnum(CharacterStyle).optional(),
  ethnicity: z.nativeEnum(Ethnicity).optional(),
  hairStyle: z.nativeEnum(HairStyle).optional(),
  hairColor: z.nativeEnum(HairColor).optional(),
  eyeColor: z.nativeEnum(EyeColor).optional(),
  bodyType: z.nativeEnum(BodyType).optional(),
  breastSize: z.nativeEnum(BreastSize).optional(),
  personality: z.nativeEnum(Personality).optional(),
  relationship: z.nativeEnum(Relationship).optional(),
  occupation: z.nativeEnum(Occupation).optional(),
  voice: z.string().min(1).optional(),
  posterId: z.string().nullish(),
  videoId: z.string().nullish(),
  kinks: z.array(z.nativeEnum(Kink)).optional(),
  isPublic: z.boolean().optional(),
  isLive: z.boolean().optional(),
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
          kinks: true,
        },
      });

      if (!character) {
        return null;
      }

      return {
        ...character,
        kinks: character.kinks.map((k) => k.kink),
      };
    }),

  /**
   * Create a new character (admin only)
   */
  create: adminProcedure
    .input(characterCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const { kinks, ...characterData } = input;

      const character = await ctx.db.character.create({
        data: {
          ...characterData,
          createdById: ctx.session.user.id,
          kinks: kinks
            ? {
                create: kinks.map((kink) => ({ kink })),
              }
            : undefined,
        },
        include: {
          poster: true,
          video: true,
          kinks: true,
        },
      });

      return character;
    }),

  /**
   * Update a character (admin only)
   */
  update: adminProcedure
    .input(characterUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, kinks, ...updateData } = input;

      // If kinks are provided, delete existing and create new ones
      if (kinks !== undefined) {
        await ctx.db.characterKink.deleteMany({
          where: { characterId: id },
        });
      }

      const character = await ctx.db.character.update({
        where: { id },
        data: {
          ...updateData,
          kinks:
            kinks !== undefined
              ? {
                  create: kinks.map((kink) => ({ kink })),
                }
              : undefined,
        },
        include: {
          poster: true,
          video: true,
          kinks: true,
        },
      });

      return character;
    }),

  /**
   * Soft delete a character (admin only)
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const character = await ctx.db.character.update({
        where: { id: input.id },
        data: { isActive: false },
      });

      return character;
    }),
});
