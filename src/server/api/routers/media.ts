import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { getPresignedUploadUrl } from "@/server/r2";

export const mediaRouter = createTRPCRouter({
  /**
   * Get a presigned URL for uploading media directly to R2
   * Returns the upload URL and the public URL where the file will be accessible
   */
  getPresignedUploadUrl: adminProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        contentType: z.string().min(1),
        folder: z
          .enum(["characters", "avatars", "posters", "videos"])
          .default("characters"),
      }),
    )
    .mutation(async ({ input }) => {
      const { filename, contentType, folder } = input;

      const result = await getPresignedUploadUrl(folder, filename, contentType);

      return {
        success: true,
        data: {
          uploadUrl: result.uploadUrl,
          publicUrl: result.publicUrl,
          key: result.key,
        },
      };
    }),

  /**
   * Create a media record in the database after successful upload
   */
  createMediaRecord: adminProcedure
    .input(
      z.object({
        key: z.string().min(1),
        url: z.string().url(),
        mimeType: z.string().min(1),
        size: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { key, url, mimeType, size } = input;

      // Determine media type from mime type
      const type = mimeType.startsWith("video/") ? "video" : "image";

      const media = await ctx.db.media.create({
        data: {
          type,
          key,
          url,
          mimeType,
          size: size ?? 0,
        },
      });

      return {
        success: true,
        data: media,
      };
    }),
});
