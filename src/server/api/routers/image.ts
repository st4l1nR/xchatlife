import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { xai } from "@/server/ai/xai";
import { fetchAndUploadToR2 } from "@/server/r2";
import { IMAGE_GENERATION_COST } from "@/lib/constants";
import { tokenService } from "@/server/services/tokenService";

// xAI API limit per request
const XAI_MAX_IMAGES_PER_REQUEST = 10;

export const imageRouter = createTRPCRouter({
  /**
   * Generate images using xAI's Grok-2 model
   * Supports up to 64 images by batching requests in groups of 10
   */
  generate: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1).max(2000),
        numberOfImages: z.number().min(1).max(64),
        characterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prompt, numberOfImages, characterId } = input;

      // Calculate token cost
      const tokenCost = numberOfImages * IMAGE_GENERATION_COST;

      // Check if user has enough tokens
      const currentBalance = await tokenService.getBalance(userId);
      if (currentBalance < tokenCost) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Insufficient tokens. You need ${tokenCost} tokens but only have ${currentBalance} remaining.`,
        });
      }

      // Verify the character exists and belongs to the user or is public
      const character = await ctx.db.character.findFirst({
        where: {
          id: characterId,
          OR: [{ createdById: userId }, { isPublic: true }],
        },
      });

      if (!character) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Character not found or not accessible",
        });
      }

      // Calculate batches needed (xAI allows max 10 images per request)
      const batches: number[] = [];
      let remaining = numberOfImages;
      while (remaining > 0) {
        const batchSize = Math.min(remaining, XAI_MAX_IMAGES_PER_REQUEST);
        batches.push(batchSize);
        remaining -= batchSize;
      }

      // Call xAI API to generate images in batches
      let generatedImageUrls: string[] = [];
      try {
        // Run all batches in parallel for better performance
        const batchPromises = batches.map((batchSize) =>
          xai.images.generate({
            model: "grok-2-image",
            prompt,
            n: batchSize,
          }),
        );

        const responses = await Promise.all(batchPromises);

        // Collect all generated image URLs
        for (const response of responses) {
          const urls = (response.data ?? [])
            .map((img) => img.url)
            .filter((url): url is string => url !== undefined);
          generatedImageUrls.push(...urls);
        }

        if (generatedImageUrls.length === 0) {
          throw new Error("No images were generated");
        }
      } catch (error) {
        console.error("[image.generate] xAI API error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate images. Please try again.",
        });
      }

      // Upload each generated image to R2 and create database records
      const characterImages = await ctx.db.$transaction(async (tx) => {
        const results = [];

        for (const imageUrl of generatedImageUrls) {
          // Upload to R2
          const uploadResult = await fetchAndUploadToR2(
            imageUrl,
            "character-images",
            "poster",
          );

          // Create media record
          const media = await tx.media.create({
            data: {
              type: "image",
              key: uploadResult.key,
              url: uploadResult.url,
              mimeType: uploadResult.mimeType,
              size: uploadResult.size,
            },
          });

          // Create character_image record with random canConvertToVideo
          const characterImage = await tx.character_image.create({
            data: {
              userId,
              characterId,
              mediaId: media.id,
              prompt,
              canConvertToVideo: Math.random() > 0.5,
            },
            include: {
              media: true,
            },
          });

          results.push(characterImage);
        }

        // Deduct tokens using the token service
        await tokenService.deductTokens(
          userId,
          tokenCost,
          "image_generation",
          `Generated ${generatedImageUrls.length} image(s)`,
          { characterId, imageCount: generatedImageUrls.length },
          tx,
        );

        return results;
      });

      return {
        success: true,
        data: characterImages,
      };
    }),

  /**
   * Get all generated images for the current user
   */
  getByUser: protectedProcedure
    .input(
      z
        .object({
          characterId: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
          cursor: z.string().nullish(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const limit = input?.limit ?? 50;
      const cursor = input?.cursor;

      const images = await ctx.db.character_image.findMany({
        take: limit + 1,
        where: {
          userId,
          ...(input?.characterId && { characterId: input.characterId }),
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          media: true,
          character: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (images.length > limit) {
        const nextItem = images.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: images,
        nextCursor,
      };
    }),
});
