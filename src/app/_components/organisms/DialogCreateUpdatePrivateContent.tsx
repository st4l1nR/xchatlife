"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
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

const privateContentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tokenPrice: z.coerce
    .number({
      required_error: "Token price is required",
      invalid_type_error: "Token price is required",
    })
    .min(0, "Token price must be 0 or greater"),
  description: z.string().min(1, "Description is required"),
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
  // Poster state
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(null);
  const [posterError, setPosterError] = useState<string | null>(null);

  // Media items state
  const [mediaItems, setMediaItems] = useState<PrivateContentMediaItem[]>([]);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const defaultValues = useMemo(
    () => ({
      name: existingContent?.name ?? "",
      tokenPrice: existingContent?.tokenPrice ?? undefined,
      description: existingContent?.description ?? "",
    }),
    [existingContent],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PrivateContentSchemaType>({
    resolver: zodResolver(privateContentSchema),
    defaultValues,
  });

  // Reset form and media state when dialog opens
  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setPosterFile(null);
      setPosterPreviewUrl(null);
      setPosterError(null);
      setMediaError(null);

      if (existingContent?.media) {
        setMediaItems(existingContent.media);
      } else {
        setMediaItems([]);
      }
    }
  }, [open, defaultValues, reset, existingContent]);

  // Cleanup poster preview URL
  useEffect(() => {
    return () => {
      if (posterPreviewUrl) {
        URL.revokeObjectURL(posterPreviewUrl);
      }
    };
  }, [posterPreviewUrl]);

  // Handle poster file change
  const handlePosterChange = useCallback((file: File | null) => {
    setPosterFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPosterPreviewUrl(url);
    } else {
      setPosterPreviewUrl(null);
    }
  }, []);

  // Handle adding new media
  const handleAddMedia = useCallback((file: File) => {
    const newItem: PrivateContentMediaItem = {
      id: generateId(),
      file,
      mediaType: isVideoFile(file) ? "video" : "image",
    };
    setMediaItems((prev) => [...prev, newItem]);
  }, []);

  // Handle removing media
  const handleRemoveMedia = useCallback((id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Handle reordering media
  const handleReorderMedia = useCallback((items: MediaUploadItem[]) => {
    setMediaItems((prev) => {
      const itemMap = new Map(prev.map((item) => [item.id, item]));
      return items
        .map((item) => itemMap.get(item.id))
        .filter((item): item is PrivateContentMediaItem => item !== undefined);
    });
  }, []);

  // Convert PrivateContentMediaItem to MediaUploadItem for ListCardMediaUpload
  const listMediaItems: MediaUploadItem[] = useMemo(
    () =>
      mediaItems.map((item) => ({
        id: item.id,
        url: item.file ? URL.createObjectURL(item.file) : item.url,
        mediaType: item.mediaType,
      })),
    [mediaItems],
  );

  // Check if poster is provided (either new file or existing URL)
  const hasPoster = posterFile || existingContent?.posterUrl;

  // Form submission
  const onFormSubmit = (data: PrivateContentSchemaType) => {
    let hasErrors = false;

    // Validate poster
    if (!hasPoster) {
      setPosterError("Poster is required");
      hasErrors = true;
    } else {
      setPosterError(null);
    }

    // Validate media (at least 1 item)
    if (mediaItems.length === 0) {
      setMediaError("At least 1 media item is required");
      hasErrors = true;
    } else {
      setMediaError(null);
    }

    if (hasErrors) return;

    onSubmit?.({
      name: data.name,
      tokenPrice: data.tokenPrice,
      description: data.description,
      posterFile,
      posterUrl: existingContent?.posterUrl,
      media: mediaItems,
    });
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Determine poster display URL
  const posterDisplayUrl = posterPreviewUrl ?? existingContent?.posterUrl;
  const posterMediaType = posterFile
    ? isVideoFile(posterFile)
      ? "video"
      : "image"
    : "image";

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
              <CardMediaUpload
                defaultMedia={posterDisplayUrl}
                defaultMediaType={posterMediaType}
                aspectRatio="9:16"
                onChange={handlePosterChange}
                disabled={loading}
                error={posterError ?? undefined}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
                }}
              />
            </div>

            {/* Right: Media Gallery */}
            <div>
              <p className="text-muted-foreground mb-2 text-sm font-medium">
                Content Media
              </p>
              <ListCardMediaUpload
                layout="grid"
                gridClassName="grid-cols-3 sm:grid-cols-2"
                items={listMediaItems}
                aspectRatio="1:1"
                onAdd={handleAddMedia}
                onRemove={handleRemoveMedia}
                onReorder={handleReorderMedia}
                disabled={loading}
              />
              {mediaError && (
                <p className="text-destructive mt-2 text-sm">{mediaError}</p>
              )}
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
