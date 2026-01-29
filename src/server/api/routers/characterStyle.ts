import { z } from "zod";
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

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  emoji: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
});

const updateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").optional(),
  label: z.string().min(1, "Label is required").optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  emoji: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
});

export const characterStyleRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.character_style.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        image: { select: { id: true, url: true, type: true } },
        video: { select: { id: true, url: true, type: true } },
      },
    });
    return { success: true, data: items };
  }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.character_style.findUnique({
        where: { id: input.id },
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
        },
      });
      return { success: true, data: item };
    }),

  create: adminProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, label, title, description, emoji, imageUrl, videoUrl } =
        input;

      let imageId: string | undefined;
      let videoId: string | undefined;

      if (imageUrl) {
        const uploadResult = await fetchAndUploadToR2(
          imageUrl,
          "character-styles",
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
        const uploadResult = await fetchAndUploadToR2(
          videoUrl,
          "character-styles",
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

      const last = await ctx.db.character_style.findFirst({
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });
      const nextSortOrder = (last?.sortOrder ?? -1) + 1;

      const newItem = await ctx.db.character_style.create({
        data: {
          name,
          label,
          title,
          description,
          emoji,
          imageId,
          videoId,
          sortOrder: nextSortOrder,
        },
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
        },
      });

      return { success: true, data: newItem };
    }),

  update: adminProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, name, label, title, description, emoji, imageUrl, videoUrl } =
        input;

      let imageId: string | undefined;
      let videoId: string | undefined;

      if (imageUrl) {
        const uploadResult = await fetchAndUploadToR2(
          imageUrl,
          "character-styles",
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
        const uploadResult = await fetchAndUploadToR2(
          videoUrl,
          "character-styles",
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

      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (label !== undefined) updateData.label = label;
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (emoji !== undefined) updateData.emoji = emoji;
      if (imageId !== undefined) updateData.imageId = imageId;
      if (videoId !== undefined) updateData.videoId = videoId;

      const updatedItem = await ctx.db.character_style.update({
        where: { id },
        data: updateData,
        include: {
          image: { select: { id: true, url: true, type: true } },
          video: { select: { id: true, url: true, type: true } },
        },
      });

      return { success: true, data: updatedItem };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.character_style.delete({ where: { id: input.id } });
      return { success: true };
    }),

  reorder: adminProcedure
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
});
