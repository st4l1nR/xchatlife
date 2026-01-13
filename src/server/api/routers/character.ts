import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc";
import { fetchAndUploadToR2 } from "@/server/r2";

// Valid gender and style names (matching database option tables)
const VALID_GENDERS = ["girl", "men", "trans"] as const;
const VALID_STYLES = ["realistic", "anime"] as const;

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
        style: z.enum(VALID_STYLES).optional(),
        gender: z.enum(VALID_GENDERS).optional(),
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
          ...(style && { style: { name: style } }),
          ...(gender && { gender: { name: gender } }),
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
          style: z.enum(VALID_STYLES).optional(),
          gender: z.enum(VALID_GENDERS).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const characters = await ctx.db.character.findMany({
        where: {
          isPublic: true,
          isActive: true,
          isLive: true,
          ...(input?.style && { style: { name: input.style } }),
          ...(input?.gender && { gender: { name: input.gender } }),
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
          gender: true,
          style: true,
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

      // Look up gender and style IDs by name
      const [genderOption, styleOption] = await Promise.all([
        ctx.db.character_gender_option.findUnique({
          where: { name: input.characterType },
        }),
        ctx.db.character_style_option.findUnique({
          where: { name: input.style },
        }),
      ]);

      if (!genderOption) {
        throw new Error(`Invalid gender: ${input.characterType}`);
      }
      if (!styleOption) {
        throw new Error(`Invalid style: ${input.style}`);
      }

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
            genderId: genderOption.id,
            styleId: styleOption.id,
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

  /**
   * Get character by ID for editing (admin only)
   * Returns full character data formatted for the edit form
   */
  getByIdForEdit: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        include: {
          poster: true,
          video: true,
          gender: true,
          style: true,
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
          reel: {
            include: {
              video: true,
              thumbnail: true,
            },
            orderBy: { sortOrder: "asc" },
          },
          story: {
            include: {
              media: true,
              thumbnail: true,
            },
            orderBy: { sortOrder: "asc" },
          },
        },
      });

      if (!character) {
        return null;
      }

      // Split name into firstName and lastName (assuming format "FirstName LastName")
      const nameParts = character.name.split(" ");
      const firstName = nameParts[0] ?? "";
      const lastName = nameParts.slice(1).join(" ");

      return {
        success: true,
        data: {
          id: character.id,
          firstName,
          lastName,
          age: character.age,
          gender: character.gender.name,
          genderId: character.genderId,
          style: character.style.name,
          styleId: character.styleId,
          isPublic: character.isPublic,
          isActive: character.isActive,
          voice: character.voice,
          // Media URLs
          posterImage: character.poster?.url,
          posterVideo: character.video?.url,
          // Option IDs for dropdowns
          ethnicityId: character.ethnicityId,
          personalityId: character.personalityId,
          hairStyleId: character.hairStyleId,
          hairColorId: character.hairColorId,
          eyeColorId: character.eyeColorId,
          bodyTypeId: character.bodyTypeId,
          breastSizeId: character.breastSizeId,
          occupationId: character.occupationId,
          relationshipId: character.relationshipId,
          // Kink IDs
          kinkIds: character.character_kink.map((k) => k.kinkId),
          // Option labels for display
          ethnicity: character.ethnicity?.label,
          personality: character.personality?.label,
          hairStyle: character.hairStyle?.label,
          hairColor: character.hairColor?.label,
          eyeColor: character.eyeColor?.label,
          bodyType: character.bodyType?.label,
          breastSize: character.breastSize?.label,
          occupation: character.occupation?.label,
          relationship: character.relationship?.label,
          kinks: character.character_kink.map((k) => k.kink.label),
          // Reels
          reels: character.reel.map((r) => ({
            id: r.id,
            url: r.video.url,
            thumbnailUrl: r.thumbnail?.url,
            mediaType: "video" as const,
            sortOrder: r.sortOrder,
          })),
          // Stories
          stories: character.story.map((s) => ({
            id: s.id,
            url: s.media.url,
            thumbnailUrl: s.thumbnail?.url,
            mediaType:
              s.media.type === "video"
                ? ("video" as const)
                : ("image" as const),
            expiresAt: s.expiresAt,
            sortOrder: s.sortOrder,
          })),
          // Stats
          chatCount: character.chatCount,
          likeCount: character.likeCount,
          messageCount: character.messageCount,
          viewCount: character.viewCount,
          createdAt: character.createdAt,
          updatedAt: character.updatedAt,
        },
      };
    }),

  /**
   * Update an existing character (admin only)
   */
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().optional(),
        age: z.number().min(18).max(999).optional(),
        gender: z.enum(VALID_GENDERS).optional(),
        style: z.enum(VALID_STYLES).optional(),
        voice: z.string().optional(),
        isPublic: z.boolean().optional(),
        isActive: z.boolean().optional(),
        // Option IDs
        ethnicityId: z.string().optional(),
        personalityId: z.string().optional(),
        hairStyleId: z.string().optional(),
        hairColorId: z.string().optional(),
        eyeColorId: z.string().optional(),
        bodyTypeId: z.string().optional(),
        breastSizeId: z.string().optional(),
        occupationId: z.string().optional(),
        relationshipId: z.string().optional(),
        kinkIds: z.array(z.string()).min(1).max(3).optional(),
        // Media URLs (only update if provided)
        posterUrl: z.string().url().optional(),
        videoUrl: z.string().url().optional(),
        // Reorder arrays
        reelOrder: z
          .array(
            z.object({
              id: z.string(),
              sortOrder: z.number(),
            }),
          )
          .optional(),
        storyOrder: z
          .array(
            z.object({
              id: z.string(),
              sortOrder: z.number(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        kinkIds,
        posterUrl,
        videoUrl,
        firstName,
        lastName,
        reelOrder,
        storyOrder,
        gender,
        style,
        ...updateData
      } = input;

      // Check if character exists
      const existingCharacter = await ctx.db.character.findUnique({
        where: { id },
        include: { poster: true, video: true },
      });

      if (!existingCharacter) {
        throw new Error("Character not found");
      }

      // Build the name from firstName and lastName
      let name: string | undefined;
      if (firstName !== undefined || lastName !== undefined) {
        const newFirstName =
          firstName ?? existingCharacter.name.split(" ")[0] ?? "";
        const newLastName =
          lastName ?? existingCharacter.name.split(" ").slice(1).join(" ");
        name = `${newFirstName} ${newLastName}`.trim();
      }

      // Look up gender and style IDs if provided
      let genderId: string | undefined;
      let styleId: string | undefined;

      if (gender) {
        const genderOption = await ctx.db.character_gender_option.findUnique({
          where: { name: gender },
        });
        if (!genderOption) {
          throw new Error(`Invalid gender: ${gender}`);
        }
        genderId = genderOption.id;
      }

      if (style) {
        const styleOption = await ctx.db.character_style_option.findUnique({
          where: { name: style },
        });
        if (!styleOption) {
          throw new Error(`Invalid style: ${style}`);
        }
        styleId = styleOption.id;
      }

      // Handle media updates
      let posterId: string | undefined;
      let videoId: string | undefined;

      if (posterUrl && posterUrl !== existingCharacter.poster?.url) {
        const posterUpload = await fetchAndUploadToR2(
          posterUrl,
          "characters",
          "poster",
        );
        const posterMedia = await ctx.db.media.create({
          data: {
            type: "image",
            key: posterUpload.key,
            url: posterUpload.url,
            mimeType: posterUpload.mimeType,
            size: posterUpload.size,
          },
        });
        posterId = posterMedia.id;
      }

      if (videoUrl && videoUrl !== existingCharacter.video?.url) {
        const videoUpload = await fetchAndUploadToR2(
          videoUrl,
          "characters",
          "video",
        );
        const videoMedia = await ctx.db.media.create({
          data: {
            type: "video",
            key: videoUpload.key,
            url: videoUpload.url,
            mimeType: videoUpload.mimeType,
            size: videoUpload.size,
          },
        });
        videoId = videoMedia.id;
      }

      // Update character in a transaction
      const character = await ctx.db.$transaction(async (tx) => {
        // Update kinks if provided
        if (kinkIds) {
          // Delete existing kinks
          await tx.character_kink.deleteMany({
            where: { characterId: id },
          });
          // Create new kinks
          await tx.character_kink.createMany({
            data: kinkIds.map((kinkId) => ({ characterId: id, kinkId })),
          });
        }

        // Update reel order if provided
        if (reelOrder && reelOrder.length > 0) {
          await Promise.all(
            reelOrder.map((item) =>
              tx.reel.update({
                where: { id: item.id },
                data: { sortOrder: item.sortOrder },
              }),
            ),
          );
        }

        // Update story order if provided
        if (storyOrder && storyOrder.length > 0) {
          await Promise.all(
            storyOrder.map((item) =>
              tx.story.update({
                where: { id: item.id },
                data: { sortOrder: item.sortOrder },
              }),
            ),
          );
        }

        // Update character
        const updatedCharacter = await tx.character.update({
          where: { id },
          data: {
            ...updateData,
            ...(name && { name }),
            ...(genderId && { genderId }),
            ...(styleId && { styleId }),
            ...(posterId && { posterId }),
            ...(videoId && { videoId }),
          },
        });

        return updatedCharacter;
      });

      return { success: true, characterId: character.id };
    }),

  /**
   * Get characters for dashboard with pagination, filtering, and sorting (admin only)
   */
  getForDashboard: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        style: z.enum(VALID_STYLES).optional(),
        sortBy: z
          .enum(["createdAt", "likeCount", "chatCount"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, style, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      // Build where clause
      const where = {
        ...(style && { style: { name: style } }),
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }),
      };

      // Get total count and characters in parallel
      const [total, characters] = await Promise.all([
        ctx.db.character.count({ where }),
        ctx.db.character.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            poster: true,
            style: true,
            user: {
              select: { name: true, email: true },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          characters: characters.map((character) => ({
            id: character.id,
            name: character.name,
            username: character.name.toLowerCase().replace(/\s+/g, "."),
            avatarSrc: character.poster?.url,
            style: character.style.name as "anime" | "realistic",
            likes: character.likeCount,
            chats: character.chatCount,
            status:
              character.isPublic && character.isActive ? "published" : "draft",
            createdAt: character.createdAt,
            createdBy: character.user.name ?? character.user.email,
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      };
    }),
});
