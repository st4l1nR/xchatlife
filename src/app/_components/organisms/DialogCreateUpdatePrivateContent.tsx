"use client";

import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/atoms/dialog";
import { Field, Label, ErrorMessage } from "@/app/_components/atoms/fieldset";
import { Input } from "@/app/_components/atoms/input";
import { Textarea } from "@/app/_components/atoms/textarea";
import CardMediaUpload from "@/app/_components/molecules/CardMediaUpload";
import ListCardMediaUpload, {
  type MediaUploadItem,
} from "@/app/_components/organisms/ListCardMediaUpload";

// ============================================================================
// Types
// ============================================================================

export type PrivateContentMediaItem = {
  id: string;
  file?: File;
  url?: string;
  mediaType?: "image" | "video";
};

export type ExistingPrivateContent = {
  id: string;
  name: string;
  tokenPrice?: number;
  description?: string;
  posterUrl?: string;
  media?: PrivateContentMediaItem[];
};

export type PrivateContentFormData = {
  name: string;
  tokenPrice?: number;
  description?: string;
  posterFile?: File | null;
  posterUrl?: string;
  media: PrivateContentMediaItem[];
};

export type DialogCreateUpdatePrivateContentProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  existingContent?: ExistingPrivateContent;
  onSubmit?: (data: PrivateContentFormData) => void;
  loading?: boolean;
};

// ============================================================================
// Schema
// ============================================================================

const mediaItemSchema = z.object({
  id: z.string(),
  file: z.instanceof(File).optional(),
  url: z.string().optional(),
  mediaType: z.enum(["image", "video"]).optional(),
});

const privateContentSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    tokenPrice: z.coerce
      .number({
        required_error: "Token price is required",
        invalid_type_error: "Token price is required",
      })
      .min(0, "Token price must be 0 or greater"),
    description: z.string().min(1, "Description is required"),
    posterFile: z.instanceof(File).nullable().optional(),
    posterUrl: z.string().optional(),
    media: z.array(mediaItemSchema).min(1, "At least 1 media item is required"),
  })
  .refine((data) => data.posterFile || data.posterUrl, {
    message: "Poster is required",
    path: ["posterFile"],
  });

type PrivateContentSchemaType = z.infer<typeof privateContentSchema>;

// ============================================================================
// Helpers
// ============================================================================

const isVideoFile = (file: File) => file.type.startsWith("video/");

const generateId = () =>
  `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============================================================================
// Main Component
// ============================================================================

const DialogCreateUpdatePrivateContent: React.FC<
  DialogCreateUpdatePrivateContentProps
> = ({
  className,
  open,
  onClose,
  mode,
  existingContent,
  onSubmit,
  loading = false,
}) => {
  const defaultValues = useMemo(
    () => ({
      name: existingContent?.name ?? "",
      tokenPrice: existingContent?.tokenPrice ?? undefined,
      description: existingContent?.description ?? "",
      posterFile: null as File | null,
      posterUrl: existingContent?.posterUrl ?? undefined,
      media: existingContent?.media ?? [],
    }),
    [existingContent],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<PrivateContentSchemaType>({
    resolver: zodResolver(privateContentSchema),
    defaultValues,
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  // Form submission
  const onFormSubmit = (data: PrivateContentSchemaType) => {
    onSubmit?.({
      name: data.name,
      tokenPrice: data.tokenPrice,
      description: data.description,
      posterFile: data.posterFile,
      posterUrl: data.posterUrl,
      media: data.media,
    });
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Watch poster values for display
  const watchedPosterFile = watch("posterFile");
  const watchedPosterUrl = watch("posterUrl");
  const watchedMedia = watch("media");

  // Compute poster display URL with cleanup
  const posterDisplayUrl = useMemo(() => {
    if (watchedPosterFile) {
      return URL.createObjectURL(watchedPosterFile);
    }
    return watchedPosterUrl;
  }, [watchedPosterFile, watchedPosterUrl]);

  // Cleanup poster blob URL
  useEffect(() => {
    return () => {
      if (posterDisplayUrl && watchedPosterFile) {
        URL.revokeObjectURL(posterDisplayUrl);
      }
    };
  }, [posterDisplayUrl, watchedPosterFile]);

  const posterMediaType =
    watchedPosterFile && isVideoFile(watchedPosterFile) ? "video" : "image";

  // Convert media items to display format with cleanup
  const listMediaItems: MediaUploadItem[] = useMemo(
    () =>
      watchedMedia.map((item) => ({
        id: item.id,
        url: item.file ? URL.createObjectURL(item.file) : item.url,
        mediaType: item.mediaType,
      })),
    [watchedMedia],
  );

  // Cleanup media blob URLs
  useEffect(() => {
    return () => {
      listMediaItems.forEach((item) => {
        if (item.url && watchedMedia.find((m) => m.id === item.id)?.file) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [listMediaItems, watchedMedia]);

  return (
    <Dialog
      className={clsx("", className)}
      open={open}
      onClose={handleClose}
      size="6xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle>
          {mode === "create"
            ? "Create Private Content"
            : "Edit Private Content"}
        </DialogTitle>
        <DialogDescription>
          Add details and media for your private content
        </DialogDescription>

        <DialogBody className="space-y-6">
          {/* Name and Token Price Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <Label>Name</Label>
              <Input
                type="text"
                placeholder="Enter content name"
                {...register("name")}
                data-invalid={errors.name ? true : undefined}
                disabled={loading}
              />
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Token Price</Label>
              <Input
                type="number"
                min={0}
                placeholder="Enter token price"
                {...register("tokenPrice")}
                data-invalid={errors.tokenPrice ? true : undefined}
                disabled={loading}
              />
              {errors.tokenPrice && (
                <ErrorMessage>{errors.tokenPrice.message}</ErrorMessage>
              )}
            </Field>
          </div>

          {/* Description Field */}
          <Field>
            <Label>Description</Label>
            <Textarea
              placeholder="Enter content description (optional)"
              rows={3}
              {...register("description")}
              data-invalid={errors.description ? true : undefined}
              disabled={loading}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </Field>

          {/* Media Section - Two Column Layout */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Left: Poster Upload */}
            <div>
              <p className="text-muted-foreground mb-2 text-sm font-medium">
                Poster
              </p>
              <Controller
                name="posterFile"
                control={control}
                render={({ field }) => (
                  <CardMediaUpload
                    defaultMedia={posterDisplayUrl}
                    defaultMediaType={posterMediaType}
                    aspectRatio="9:16"
                    onChange={(file) => field.onChange(file)}
                    disabled={loading}
                    error={errors.posterFile?.message}
                    accept={{
                      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
                    }}
                  />
                )}
              />
            </div>

            {/* Right: Media Gallery */}
            <div>
              <p className="text-muted-foreground mb-2 text-sm font-medium">
                Content Media
              </p>
              <Controller
                name="media"
                control={control}
                render={({ field }) => (
                  <>
                    <ListCardMediaUpload
                      layout="grid"
                      gridClassName="grid-cols-3 sm:grid-cols-2"
                      items={listMediaItems}
                      aspectRatio="1:1"
                      onAdd={(file: File) => {
                        const newItem: PrivateContentMediaItem = {
                          id: generateId(),
                          file,
                          mediaType: isVideoFile(file) ? "video" : "image",
                        };
                        field.onChange([...field.value, newItem]);
                      }}
                      onRemove={(id: string) => {
                        field.onChange(
                          field.value.filter((item) => item.id !== id),
                        );
                      }}
                      onReorder={(items: MediaUploadItem[]) => {
                        const itemMap = new Map(
                          field.value.map((item) => [item.id, item]),
                        );
                        const reordered = items
                          .map((item) => itemMap.get(item.id))
                          .filter(
                            (item): item is PrivateContentMediaItem =>
                              item !== undefined,
                          );
                        field.onChange(reordered);
                      }}
                      disabled={loading}
                    />
                    {errors.media?.message && (
                      <p className="text-destructive mt-2 text-sm">
                        {errors.media.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {mode === "create" ? "Create" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogCreateUpdatePrivateContent;
