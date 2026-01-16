import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Valid gender and style names (matching database option tables)
const VALID_GENDERS = ["girl", "men", "trans"] as const;
const VALID_STYLES = ["realistic", "anime"] as const;

// ============================================================================
// Input Schemas
// ============================================================================

const getVariantOptionsSchema = z.object({
  gender: z.enum(VALID_GENDERS),
  style: z.enum(VALID_STYLES),
});

// ============================================================================
// Router
// ============================================================================

export const optionsRouter = createTRPCRouter({
  /**
   * Get all character variants (for step 1)
   * Returns variants grouped by gender for the character type/style selection
   */
  getCharacterVariants: publicProcedure.query(async ({ ctx }) => {
    const rawVariants = await ctx.db.character_variant.findMany({
      orderBy: [{ genderId: "asc" }, { sortOrder: "asc" }],
      select: {
        id: true,
        name: true,
        label: true,
        gender: { select: { name: true, label: true } },
        style: { select: { name: true, label: true } },
        isActive: true,
        sortOrder: true,
        image: { select: { url: true } },
        video: { select: { url: true } },
      },
    });

    // Transform to include imageSrc and videoSrc with flattened gender/style
    const variants = rawVariants.map((v) => ({
      id: v.id,
      name: v.name,
      label: v.label,
      gender: v.gender.name,
      style: v.style.name,
      isActive: v.isActive,
      sortOrder: v.sortOrder,
      imageSrc: v.image?.url ?? null,
      videoSrc: v.video?.url ?? null,
    }));

    // Group variants by gender
    const groupedByGender = variants.reduce(
      (acc, variant) => {
        if (!acc[variant.gender]) {
          acc[variant.gender] = [];
        }
        acc[variant.gender]!.push(variant);
        return acc;
      },
      {} as Record<string, typeof variants>,
    );

    return {
      success: true,
      data: {
        variants,
        groupedByGender,
      },
    };
  }),

  /**
   * Get variant-specific options (for steps 2-4)
   * These options have different images per variant (gender + style combination)
   */
  getVariantOptions: publicProcedure
    .input(getVariantOptionsSchema)
    .query(async ({ ctx, input }) => {
      // Find gender and style options by name
      const [genderOption, styleOption] = await Promise.all([
        ctx.db.character_gender.findUnique({
          where: { name: input.gender },
        }),
        ctx.db.character_style.findUnique({
          where: { name: input.style },
        }),
      ]);

      if (!genderOption || !styleOption) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gender or style not found",
        });
      }

      // Fetch all variant-specific options in parallel using genderId + styleId
      const [
        rawEthnicities,
        rawHairStyles,
        rawHairColors,
        rawEyeColors,
        rawBodyTypes,
        rawBreastSizes,
      ] = await Promise.all([
        ctx.db.character_ethnicity.findMany({
          where: {
            genderId: genderOption.id,
            styleId: styleOption.id,
            isActive: true,
          },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
            video: { select: { url: true } },
          },
        }),
        ctx.db.character_hair_style.findMany({
          where: {
            genderId: genderOption.id,
            styleId: styleOption.id,
            isActive: true,
          },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
            video: { select: { url: true } },
          },
        }),
        ctx.db.character_hair_color.findMany({
          where: {
            genderId: genderOption.id,
            styleId: styleOption.id,
            isActive: true,
          },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
            video: { select: { url: true } },
          },
        }),
        ctx.db.character_eye_color.findMany({
          where: {
            genderId: genderOption.id,
            styleId: styleOption.id,
            isActive: true,
          },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
            video: { select: { url: true } },
          },
        }),
        ctx.db.character_body_type.findMany({
          where: {
            genderId: genderOption.id,
            styleId: styleOption.id,
            isActive: true,
          },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
            video: { select: { url: true } },
          },
        }),
        ctx.db.character_breast_size.findMany({
          where: {
            genderId: genderOption.id,
            styleId: styleOption.id,
            isActive: true,
          },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
            video: { select: { url: true } },
          },
        }),
      ]);

      // Transform all options to include imageSrc and videoSrc
      const transformOption = (opt: {
        id: string;
        name: string;
        label: string;
        image: { url: string } | null;
        video: { url: string } | null;
      }) => ({
        id: opt.id,
        name: opt.name,
        label: opt.label,
        imageSrc: opt.image?.url ?? "",
        videoSrc: opt.video?.url ?? null,
      });

      return {
        success: true,
        data: {
          genderId: genderOption.id,
          styleId: styleOption.id,
          ethnicities: rawEthnicities.map(transformOption),
          hairStyles: rawHairStyles.map(transformOption),
          hairColors: rawHairColors.map(transformOption),
          eyeColors: rawEyeColors.map(transformOption),
          bodyTypes: rawBodyTypes.map(transformOption),
          breastSizes: rawBreastSizes.map(transformOption),
        },
      };
    }),

  /**
   * Get gender and style options
   * Used for character edit form dropdowns
   */
  getGenderAndStyleOptions: publicProcedure.query(async ({ ctx }) => {
    const [genders, styles] = await Promise.all([
      ctx.db.character_gender.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, label: true, emoji: true },
      }),
      ctx.db.character_style.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, label: true, emoji: true },
      }),
    ]);
    return {
      success: true,
      data: { genders, styles },
    };
  }),

  /**
   * Get universal options (for step 5)
   * These options are the same for all variants
   */
  getUniversalOptions: publicProcedure
    .input(getVariantOptionsSchema)
    .query(async ({ ctx, input }) => {
      // Find gender and style options by name
      const [genderOption, styleOption] = await Promise.all([
        ctx.db.character_gender.findUnique({
          where: { name: input.gender },
        }),
        ctx.db.character_style.findUnique({
          where: { name: input.style },
        }),
      ]);

      if (!genderOption || !styleOption) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gender or style not found",
        });
      }

      // Fetch all universal options in parallel (filtered by gender + style)
      const [rawPersonalities, rawRelationships, occupations] =
        await Promise.all([
          ctx.db.character_personality.findMany({
            where: {
              genderId: genderOption.id,
              styleId: styleOption.id,
              isActive: true,
            },
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              name: true,
              label: true,
              image: { select: { url: true } },
            },
          }),
          ctx.db.character_relationship.findMany({
            where: {
              genderId: genderOption.id,
              styleId: styleOption.id,
              isActive: true,
            },
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              name: true,
              label: true,
              image: { select: { url: true } },
            },
          }),
          ctx.db.character_occupation.findMany({
            where: {
              genderId: genderOption.id,
              styleId: styleOption.id,
              isActive: true,
            },
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              name: true,
              label: true,
              emoji: true,
            },
          }),
        ]);

      // Transform personality and relationship options to include imageSrc
      const personalities = rawPersonalities.map((p) => ({
        id: p.id,
        name: p.name,
        label: p.label,
        imageSrc: p.image?.url ?? null,
      }));

      const relationships = rawRelationships.map((r) => ({
        id: r.id,
        name: r.name,
        label: r.label,
        imageSrc: r.image?.url ?? null,
      }));

      return {
        success: true,
        data: {
          personalities,
          relationships,
          occupations,
        },
      };
    }),

  /**
   * Get all character options in a single call
   * Fetches ALL options upfront so filtering can happen on the frontend
   * without additional queries when gender/style changes
   *
   * OPTIMIZATION: Queries are executed in groups of 3-4 to avoid exceeding
   * the connection pool limit of Prisma Postgres free tier
   */
  getAllCharacterOptions: publicProcedure.query(async ({ ctx }) => {
    // Group 1: Base options (2 queries + media relations)
    const [genders, styles] = await Promise.all([
      ctx.db.character_gender.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, label: true, emoji: true },
      }),
      ctx.db.character_style.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, label: true, emoji: true },
      }),
    ]);

    // Group 2: Variant options part 1 (3 queries + media relations)
    const [rawEthnicities, rawHairStyles, rawHairColors] = await Promise.all([
      ctx.db.character_ethnicity.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          label: true,
          genderId: true,
          styleId: true,
          image: { select: { url: true } },
          video: { select: { url: true } },
        },
      }),
      ctx.db.character_hair_style.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          label: true,
          genderId: true,
          styleId: true,
          image: { select: { url: true } },
          video: { select: { url: true } },
        },
      }),
      ctx.db.character_hair_color.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          label: true,
          genderId: true,
          styleId: true,
          image: { select: { url: true } },
          video: { select: { url: true } },
        },
      }),
    ]);

    // Group 3: Variant options part 2 (3 queries + media relations)
    const [rawEyeColors, rawBodyTypes, rawBreastSizes] = await Promise.all([
      ctx.db.character_eye_color.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          label: true,
          genderId: true,
          styleId: true,
          image: { select: { url: true } },
          video: { select: { url: true } },
        },
      }),
      ctx.db.character_body_type.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          label: true,
          genderId: true,
          styleId: true,
          image: { select: { url: true } },
          video: { select: { url: true } },
        },
      }),
      ctx.db.character_breast_size.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          label: true,
          genderId: true,
          styleId: true,
          image: { select: { url: true } },
          video: { select: { url: true } },
        },
      }),
    ]);

    // Group 4: Universal options (3 queries + media relations)
    const [rawPersonalities, rawRelationships, rawOccupations] =
      await Promise.all([
        ctx.db.character_personality.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            genderId: true,
            styleId: true,
            image: { select: { url: true } },
          },
        }),
        ctx.db.character_relationship.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            genderId: true,
            styleId: true,
            image: { select: { url: true } },
          },
        }),
        ctx.db.character_occupation.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            genderId: true,
            styleId: true,
            emoji: true,
          },
        }),
      ]);

    // Transform variant options (keep genderId/styleId for filtering)
    const transformVariantOption = (opt: {
      id: string;
      name: string;
      label: string;
      genderId: string;
      styleId: string;
      image: { url: string } | null;
      video: { url: string } | null;
    }) => ({
      id: opt.id,
      name: opt.name,
      label: opt.label,
      genderId: opt.genderId,
      styleId: opt.styleId,
      imageSrc: opt.image?.url ?? "",
      videoSrc: opt.video?.url ?? null,
    });

    // Transform universal options with image (keep genderId/styleId for filtering)
    const transformUniversalOption = (opt: {
      id: string;
      name: string;
      label: string;
      genderId: string;
      styleId: string;
      image: { url: string } | null;
    }) => ({
      id: opt.id,
      name: opt.name,
      label: opt.label,
      genderId: opt.genderId,
      styleId: opt.styleId,
      imageSrc: opt.image?.url ?? null,
    });

    // Transform occupation (keep genderId/styleId for filtering)
    const transformOccupation = (opt: {
      id: string;
      name: string;
      label: string;
      genderId: string;
      styleId: string;
      emoji: string | null;
    }) => ({
      id: opt.id,
      name: opt.name,
      label: opt.label,
      genderId: opt.genderId,
      styleId: opt.styleId,
      emoji: opt.emoji,
    });

    return {
      success: true,
      data: {
        genders,
        styles,
        // All options with genderId/styleId for frontend filtering
        ethnicities: rawEthnicities.map(transformVariantOption),
        hairStyles: rawHairStyles.map(transformVariantOption),
        hairColors: rawHairColors.map(transformVariantOption),
        eyeColors: rawEyeColors.map(transformVariantOption),
        bodyTypes: rawBodyTypes.map(transformVariantOption),
        breastSizes: rawBreastSizes.map(transformVariantOption),
        personalities: rawPersonalities.map(transformUniversalOption),
        relationships: rawRelationships.map(transformUniversalOption),
        occupations: rawOccupations.map(transformOccupation),
      },
    };
  }),
});
