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
        ctx.db.character_gender_option.findUnique({
          where: { name: input.gender },
        }),
        ctx.db.character_style_option.findUnique({
          where: { name: input.style },
        }),
      ]);

      if (!genderOption || !styleOption) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gender or style not found",
        });
      }

      // Find variant by genderId + styleId
      const variant = await ctx.db.character_variant.findUnique({
        where: {
          genderId_styleId: {
            genderId: genderOption.id,
            styleId: styleOption.id,
          },
        },
      });

      if (!variant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Variant not found",
        });
      }

      // Fetch all variant-specific options in parallel
      const [
        rawEthnicities,
        rawHairStyles,
        rawHairColors,
        rawEyeColors,
        rawBodyTypes,
        rawBreastSizes,
      ] = await Promise.all([
        ctx.db.ethnicity_option.findMany({
          where: { variantId: variant.id, isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
            video: { select: { url: true } },
          },
        }),
        ctx.db.hair_style_option.findMany({
          where: { variantId: variant.id, isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
            video: { select: { url: true } },
          },
        }),
        ctx.db.hair_color_option.findMany({
          where: { variantId: variant.id, isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
            video: { select: { url: true } },
          },
        }),
        ctx.db.eye_color_option.findMany({
          where: { variantId: variant.id, isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
            video: { select: { url: true } },
          },
        }),
        ctx.db.body_type_option.findMany({
          where: { variantId: variant.id, isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
            video: { select: { url: true } },
          },
        }),
        ctx.db.breast_size_option.findMany({
          where: { variantId: variant.id, isActive: true },
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
          variantId: variant.id,
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
   * Get universal options (for step 5)
   * These options are the same for all variants
   */
  getUniversalOptions: publicProcedure.query(async ({ ctx }) => {
    // Fetch all universal options in parallel
    const [rawPersonalities, rawRelationships, occupations, kinks] =
      await Promise.all([
        ctx.db.personality_option.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
          },
        }),
        ctx.db.relationship_option.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            image: { select: { url: true } },
          },
        }),
        ctx.db.occupation_option.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
            emoji: true,
          },
        }),
        ctx.db.kink_option.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            label: true,
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
        kinks,
      },
    };
  }),
});
