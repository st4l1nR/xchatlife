import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { fetchAndUploadToR2 } from "@/server/r2";

const reorderInputSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number(),
    }),
  ),
});

// Property types supported by the generic CRUD operations
const propertyTypeSchema = z.enum([
  "personality",
  "relationship",
  "occupation",
  "ethnicity",
  "hairStyle",
  "hairColor",
  "eyeColor",
  "bodyType",
  "breastSize",
  "gender",
  "style",
]);

export type CharacterPropertyType = z.infer<typeof propertyTypeSchema>;

// Schema for creating/updating character properties
const createPropertySchema = z.object({
  propertyType: propertyTypeSchema,
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  description: z.string().optional(),
  emoji: z.string().optional(),
  genderId: z.string().optional(), // Not required for gender/style types
  styleId: z.string().optional(), // Not required for gender/style types
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
});

const updatePropertySchema = z.object({
  id: z.string(),
  propertyType: propertyTypeSchema,
  name: z.string().min(1, "Name is required").optional(),
  label: z.string().min(1, "Label is required").optional(),
  description: z.string().optional(),
  emoji: z.string().optional(),
  genderId: z.string().optional(),
  styleId: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
});

const deletePropertySchema = z.object({
  id: z.string(),
  propertyType: propertyTypeSchema,
});

// Helper to get folder name for R2 uploads
const getR2Folder = (propertyType: CharacterPropertyType): string => {
  const folderMap: Record<CharacterPropertyType, string> = {
    personality: "character-personalities",
    relationship: "character-relationships",
    occupation: "character-occupations",
    ethnicity: "character-ethnicities",
    hairStyle: "character-hair-styles",
    hairColor: "character-hair-colors",
    eyeColor: "character-eye-colors",
    bodyType: "character-body-types",
    breastSize: "character-breast-sizes",
    gender: "character-genders",
    style: "character-styles",
  };
  return folderMap[propertyType];
};

export const characterOptionsRouter = createTRPCRouter({
  // ============================================================================
  // Gender
  // ============================================================================
  getGenders: adminProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.character_gender.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        image: { select: { id: true, url: true, type: true } },
        video: { select: { id: true, url: true, type: true } },
      },
    });
    return { success: true, data: items };
  }),

  reorderGenders: adminProcedure
    .input(reorderInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.character_gender.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );
      return { success: true };
    }),

  // ============================================================================
  // Style
  // ============================================================================
  getStyles: adminProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.character_style.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        image: { select: { id: true, url: true, type: true } },
        video: { select: { id: true, url: true, type: true } },
      },
    });
    return { success: true, data: items };
  }),

  reorderStyles: adminProcedure
    .input(reorderInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.character_style.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );
      return { success: true };
    }),

  // ============================================================================
  // Ethnicity
  // ============================================================================
  getEthnicities: adminProcedure
    .input(
      z
        .object({
          genderId: z.string().optional(),
          styleId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.character_ethnicity.findMany({
        where: {
          ...(input?.genderId && { genderId: input.genderId }),
          ...(input?.styleId && { styleId: input.styleId }),
        },
        orderBy: { sortOrder: "asc" },
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
          gender: { select: { id: true, name: true, label: true } },
          style: { select: { id: true, name: true, label: true } },
        },
      });
      return { success: true, data: items };
    }),

  reorderEthnicities: adminProcedure
    .input(reorderInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.character_ethnicity.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );
      return { success: true };
    }),

  // ============================================================================
  // Hair Style
  // ============================================================================
  getHairStyles: adminProcedure
    .input(
      z
        .object({
          genderId: z.string().optional(),
          styleId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.character_hair_style.findMany({
        where: {
          ...(input?.genderId && { genderId: input.genderId }),
          ...(input?.styleId && { styleId: input.styleId }),
        },
        orderBy: { sortOrder: "asc" },
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
          gender: { select: { id: true, name: true, label: true } },
          style: { select: { id: true, name: true, label: true } },
        },
      });
      return { success: true, data: items };
    }),

  reorderHairStyles: adminProcedure
    .input(reorderInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.character_hair_style.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );
      return { success: true };
    }),

  // ============================================================================
  // Hair Color
  // ============================================================================
  getHairColors: adminProcedure
    .input(
      z
        .object({
          genderId: z.string().optional(),
          styleId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.character_hair_color.findMany({
        where: {
          ...(input?.genderId && { genderId: input.genderId }),
          ...(input?.styleId && { styleId: input.styleId }),
        },
        orderBy: { sortOrder: "asc" },
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
          gender: { select: { id: true, name: true, label: true } },
          style: { select: { id: true, name: true, label: true } },
        },
      });
      return { success: true, data: items };
    }),

  reorderHairColors: adminProcedure
    .input(reorderInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.character_hair_color.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );
      return { success: true };
    }),

  // ============================================================================
  // Eye Color
  // ============================================================================
  getEyeColors: adminProcedure
    .input(
      z
        .object({
          genderId: z.string().optional(),
          styleId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.character_eye_color.findMany({
        where: {
          ...(input?.genderId && { genderId: input.genderId }),
          ...(input?.styleId && { styleId: input.styleId }),
        },
        orderBy: { sortOrder: "asc" },
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
          gender: { select: { id: true, name: true, label: true } },
          style: { select: { id: true, name: true, label: true } },
        },
      });
      return { success: true, data: items };
    }),

  reorderEyeColors: adminProcedure
    .input(reorderInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.character_eye_color.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );
      return { success: true };
    }),

  // ============================================================================
  // Body Type
  // ============================================================================
  getBodyTypes: adminProcedure
    .input(
      z
        .object({
          genderId: z.string().optional(),
          styleId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.character_body_type.findMany({
        where: {
          ...(input?.genderId && { genderId: input.genderId }),
          ...(input?.styleId && { styleId: input.styleId }),
        },
        orderBy: { sortOrder: "asc" },
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
          gender: { select: { id: true, name: true, label: true } },
          style: { select: { id: true, name: true, label: true } },
        },
      });
      return { success: true, data: items };
    }),

  reorderBodyTypes: adminProcedure
    .input(reorderInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.character_body_type.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );
      return { success: true };
    }),

  // ============================================================================
  // Breast Size
  // ============================================================================
  getBreastSizes: adminProcedure
    .input(
      z
        .object({
          genderId: z.string().optional(),
          styleId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.character_breast_size.findMany({
        where: {
          ...(input?.genderId && { genderId: input.genderId }),
          ...(input?.styleId && { styleId: input.styleId }),
        },
        orderBy: { sortOrder: "asc" },
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
          gender: { select: { id: true, name: true, label: true } },
          style: { select: { id: true, name: true, label: true } },
        },
      });
      return { success: true, data: items };
    }),

  reorderBreastSizes: adminProcedure
    .input(reorderInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.character_breast_size.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );
      return { success: true };
    }),

  // ============================================================================
  // Personality
  // ============================================================================
  getPersonalities: adminProcedure
    .input(
      z
        .object({
          genderId: z.string().optional(),
          styleId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.character_personality.findMany({
        where: {
          ...(input?.genderId && { genderId: input.genderId }),
          ...(input?.styleId && { styleId: input.styleId }),
        },
        orderBy: { sortOrder: "asc" },
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
          gender: { select: { id: true, name: true, label: true } },
          style: { select: { id: true, name: true, label: true } },
        },
      });
      return { success: true, data: items };
    }),

  reorderPersonalities: adminProcedure
    .input(reorderInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.character_personality.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );
      return { success: true };
    }),

  // ============================================================================
  // Relationship
  // ============================================================================
  getRelationships: adminProcedure
    .input(
      z
        .object({
          genderId: z.string().optional(),
          styleId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.character_relationship.findMany({
        where: {
          ...(input?.genderId && { genderId: input.genderId }),
          ...(input?.styleId && { styleId: input.styleId }),
        },
        orderBy: { sortOrder: "asc" },
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
          gender: { select: { id: true, name: true, label: true } },
          style: { select: { id: true, name: true, label: true } },
        },
      });
      return { success: true, data: items };
    }),

  reorderRelationships: adminProcedure
    .input(reorderInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.character_relationship.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );
      return { success: true };
    }),

  // ============================================================================
  // Occupation
  // ============================================================================
  getOccupations: adminProcedure
    .input(
      z
        .object({
          genderId: z.string().optional(),
          styleId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.character_occupation.findMany({
        where: {
          ...(input?.genderId && { genderId: input.genderId }),
          ...(input?.styleId && { styleId: input.styleId }),
        },
        orderBy: { sortOrder: "asc" },
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
          gender: { select: { id: true, name: true, label: true } },
          style: { select: { id: true, name: true, label: true } },
        },
      });
      return { success: true, data: items };
    }),

  reorderOccupations: adminProcedure
    .input(reorderInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.items.map((item) =>
          ctx.db.character_occupation.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );
      return { success: true };
    }),

  // ============================================================================
  // Generic CRUD Operations
  // ============================================================================

  /**
   * Create a new character property (generic for all types)
   */
  createProperty: adminProcedure
    .input(createPropertySchema)
    .mutation(async ({ ctx, input }) => {
      const {
        propertyType,
        name,
        label,
        description,
        emoji,
        genderId,
        styleId,
        imageUrl,
        videoUrl,
      } = input;

      // Validate genderId and styleId are provided for non-gender/style types
      const requiresGenderStyle = !["gender", "style"].includes(propertyType);
      if (requiresGenderStyle && (!genderId || !styleId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Gender and Style are required for this property type",
        });
      }

      // Handle media uploads if URLs are provided
      let imageId: string | undefined;
      let videoId: string | undefined;

      if (imageUrl) {
        const folder = getR2Folder(propertyType);
        const uploadResult = await fetchAndUploadToR2(
          imageUrl,
          folder,
          "poster",
        );
        const media = await ctx.db.media.create({
          data: {
            type: "image",
            key: uploadResult.key,
            url: uploadResult.url,
            mimeType: uploadResult.mimeType,
            size: uploadResult.size,
          },
        });
        imageId = media.id;
      }

      if (videoUrl) {
        const folder = getR2Folder(propertyType);
        const uploadResult = await fetchAndUploadToR2(
          videoUrl,
          folder,
          "video",
        );
        const media = await ctx.db.media.create({
          data: {
            type: "video",
            key: uploadResult.key,
            url: uploadResult.url,
            mimeType: uploadResult.mimeType,
            size: uploadResult.size,
          },
        });
        videoId = media.id;
      }

      // Get the next sortOrder for the specific property type
      let lastSortOrder = -1;
      switch (propertyType) {
        case "personality": {
          const last = await ctx.db.character_personality.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
          });
          lastSortOrder = last?.sortOrder ?? -1;
          break;
        }
        case "relationship": {
          const last = await ctx.db.character_relationship.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
          });
          lastSortOrder = last?.sortOrder ?? -1;
          break;
        }
        case "occupation": {
          const last = await ctx.db.character_occupation.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
          });
          lastSortOrder = last?.sortOrder ?? -1;
          break;
        }
        case "ethnicity": {
          const last = await ctx.db.character_ethnicity.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
          });
          lastSortOrder = last?.sortOrder ?? -1;
          break;
        }
        case "hairStyle": {
          const last = await ctx.db.character_hair_style.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
          });
          lastSortOrder = last?.sortOrder ?? -1;
          break;
        }
        case "hairColor": {
          const last = await ctx.db.character_hair_color.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
          });
          lastSortOrder = last?.sortOrder ?? -1;
          break;
        }
        case "eyeColor": {
          const last = await ctx.db.character_eye_color.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
          });
          lastSortOrder = last?.sortOrder ?? -1;
          break;
        }
        case "bodyType": {
          const last = await ctx.db.character_body_type.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
          });
          lastSortOrder = last?.sortOrder ?? -1;
          break;
        }
        case "breastSize": {
          const last = await ctx.db.character_breast_size.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
          });
          lastSortOrder = last?.sortOrder ?? -1;
          break;
        }
        case "gender": {
          const last = await ctx.db.character_gender.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
          });
          lastSortOrder = last?.sortOrder ?? -1;
          break;
        }
        case "style": {
          const last = await ctx.db.character_style.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
          });
          lastSortOrder = last?.sortOrder ?? -1;
          break;
        }
      }
      const nextSortOrder = lastSortOrder + 1;

      // Build the data object based on property type
      const baseData = {
        name,
        label,
        description,
        emoji,
        imageId,
        videoId,
        sortOrder: nextSortOrder,
      };

      // For gender and style types, we don't need genderId/styleId
      const dataWithRelations = requiresGenderStyle
        ? { ...baseData, genderId, styleId }
        : baseData;

      // Create the property using the appropriate model
      let newProperty;
      switch (propertyType) {
        case "personality":
          newProperty = await ctx.db.character_personality.create({
            data: dataWithRelations as Parameters<
              typeof ctx.db.character_personality.create
            >[0]["data"],
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "relationship":
          newProperty = await ctx.db.character_relationship.create({
            data: dataWithRelations as Parameters<
              typeof ctx.db.character_relationship.create
            >[0]["data"],
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "occupation":
          newProperty = await ctx.db.character_occupation.create({
            data: dataWithRelations as Parameters<
              typeof ctx.db.character_occupation.create
            >[0]["data"],
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "ethnicity":
          newProperty = await ctx.db.character_ethnicity.create({
            data: dataWithRelations as Parameters<
              typeof ctx.db.character_ethnicity.create
            >[0]["data"],
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "hairStyle":
          newProperty = await ctx.db.character_hair_style.create({
            data: dataWithRelations as Parameters<
              typeof ctx.db.character_hair_style.create
            >[0]["data"],
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "hairColor":
          newProperty = await ctx.db.character_hair_color.create({
            data: dataWithRelations as Parameters<
              typeof ctx.db.character_hair_color.create
            >[0]["data"],
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "eyeColor":
          newProperty = await ctx.db.character_eye_color.create({
            data: dataWithRelations as Parameters<
              typeof ctx.db.character_eye_color.create
            >[0]["data"],
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "bodyType":
          newProperty = await ctx.db.character_body_type.create({
            data: dataWithRelations as Parameters<
              typeof ctx.db.character_body_type.create
            >[0]["data"],
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "breastSize":
          newProperty = await ctx.db.character_breast_size.create({
            data: dataWithRelations as Parameters<
              typeof ctx.db.character_breast_size.create
            >[0]["data"],
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "gender":
          newProperty = await ctx.db.character_gender.create({
            data: baseData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
            },
          });
          break;
        case "style":
          newProperty = await ctx.db.character_style.create({
            data: baseData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
            },
          });
          break;
      }

      return { success: true, data: newProperty };
    }),

  /**
   * Update an existing character property
   */
  updateProperty: adminProcedure
    .input(updatePropertySchema)
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        propertyType,
        name,
        label,
        description,
        emoji,
        genderId,
        styleId,
        imageUrl,
        videoUrl,
      } = input;

      // Handle media uploads if URLs are provided
      let imageId: string | undefined;
      let videoId: string | undefined;

      if (imageUrl) {
        const folder = getR2Folder(propertyType);
        const uploadResult = await fetchAndUploadToR2(
          imageUrl,
          folder,
          "poster",
        );
        const media = await ctx.db.media.create({
          data: {
            type: "image",
            key: uploadResult.key,
            url: uploadResult.url,
            mimeType: uploadResult.mimeType,
            size: uploadResult.size,
          },
        });
        imageId = media.id;
      }

      if (videoUrl) {
        const folder = getR2Folder(propertyType);
        const uploadResult = await fetchAndUploadToR2(
          videoUrl,
          folder,
          "video",
        );
        const media = await ctx.db.media.create({
          data: {
            type: "video",
            key: uploadResult.key,
            url: uploadResult.url,
            mimeType: uploadResult.mimeType,
            size: uploadResult.size,
          },
        });
        videoId = media.id;
      }

      // Build update data
      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (label !== undefined) updateData.label = label;
      if (description !== undefined) updateData.description = description;
      if (emoji !== undefined) updateData.emoji = emoji;
      if (genderId !== undefined) updateData.genderId = genderId;
      if (styleId !== undefined) updateData.styleId = styleId;
      if (imageId !== undefined) updateData.imageId = imageId;
      if (videoId !== undefined) updateData.videoId = videoId;

      // Update the property using the appropriate model
      let updatedProperty;
      switch (propertyType) {
        case "personality":
          updatedProperty = await ctx.db.character_personality.update({
            where: { id },
            data: updateData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "relationship":
          updatedProperty = await ctx.db.character_relationship.update({
            where: { id },
            data: updateData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "occupation":
          updatedProperty = await ctx.db.character_occupation.update({
            where: { id },
            data: updateData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "ethnicity":
          updatedProperty = await ctx.db.character_ethnicity.update({
            where: { id },
            data: updateData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "hairStyle":
          updatedProperty = await ctx.db.character_hair_style.update({
            where: { id },
            data: updateData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "hairColor":
          updatedProperty = await ctx.db.character_hair_color.update({
            where: { id },
            data: updateData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "eyeColor":
          updatedProperty = await ctx.db.character_eye_color.update({
            where: { id },
            data: updateData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "bodyType":
          updatedProperty = await ctx.db.character_body_type.update({
            where: { id },
            data: updateData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "breastSize":
          updatedProperty = await ctx.db.character_breast_size.update({
            where: { id },
            data: updateData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
              gender: { select: { id: true, name: true, label: true } },
              style: { select: { id: true, name: true, label: true } },
            },
          });
          break;
        case "gender":
          updatedProperty = await ctx.db.character_gender.update({
            where: { id },
            data: updateData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
            },
          });
          break;
        case "style":
          updatedProperty = await ctx.db.character_style.update({
            where: { id },
            data: updateData,
            include: {
              image: { select: { id: true, url: true, type: true } },
              video: { select: { id: true, url: true, type: true } },
            },
          });
          break;
      }

      return { success: true, data: updatedProperty };
    }),

  /**
   * Delete a character property
   */
  deleteProperty: adminProcedure
    .input(deletePropertySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, propertyType } = input;

      switch (propertyType) {
        case "personality":
          await ctx.db.character_personality.delete({ where: { id } });
          break;
        case "relationship":
          await ctx.db.character_relationship.delete({ where: { id } });
          break;
        case "occupation":
          await ctx.db.character_occupation.delete({ where: { id } });
          break;
        case "ethnicity":
          await ctx.db.character_ethnicity.delete({ where: { id } });
          break;
        case "hairStyle":
          await ctx.db.character_hair_style.delete({ where: { id } });
          break;
        case "hairColor":
          await ctx.db.character_hair_color.delete({ where: { id } });
          break;
        case "eyeColor":
          await ctx.db.character_eye_color.delete({ where: { id } });
          break;
        case "bodyType":
          await ctx.db.character_body_type.delete({ where: { id } });
          break;
        case "breastSize":
          await ctx.db.character_breast_size.delete({ where: { id } });
          break;
        case "gender":
          await ctx.db.character_gender.delete({ where: { id } });
          break;
        case "style":
          await ctx.db.character_style.delete({ where: { id } });
          break;
      }

      return { success: true };
    }),
});
