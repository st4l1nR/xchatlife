"use client";

import React, { useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
import { useDropzone, type Accept } from "react-dropzone";
import { Upload } from "lucide-react";

export type AspectRatio = "16:9" | "4:3" | "1:1" | "3:4" | "9:16";

export type CardMediaUploadProps = {
  className?: string;
  label?: string;
  defaultMedia?: string;
  defaultMediaType?: "image" | "video";
  aspectRatio?: AspectRatio;
  accept?: Accept;
  maxSize?: number;
  disabled?: boolean;
  readOnly?: boolean;
  enablePreview?: boolean;
  showBrowseButton?: boolean;
  error?: string;
  onChange?: (file: File | null) => void;
  onRemove?: () => void;
};

const aspectRatioClasses: Record<AspectRatio, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "3:4": "aspect-[3/4]",
  "9:16": "aspect-[9/16]",
};

const isVideoFile = (file: File) => file.type.startsWith("video/");

const isVideoUrl = (url: string, explicitType?: "image" | "video") => {
  if (explicitType) return explicitType === "video";
  return /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(url);
};

const CardMediaUpload: React.FC<CardMediaUploadProps> = ({
  className,
  label,
  defaultMedia,
  defaultMediaType,
  aspectRatio = "1:1",
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    "video/*": [".mp4", ".webm", ".mov"],
  },
  maxSize = 50 * 1024 * 1024, // 50MB default for video support
  disabled = false,
  readOnly = false,
  enablePreview = true,
  showBrowseButton = false,
  error,
  onChange,
  onRemove: _onRemove,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(
    null,
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (enablePreview) {
          const objectUrl = URL.createObjectURL(file);
          setPreview(objectUrl);
          setPreviewType(isVideoFile(file) ? "video" : "image");
        }
        onChange?.(file);
      }
    },
    [onChange, enablePreview],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    disabled: disabled || readOnly,
    multiple: false,
    noClick: readOnly,
    noDrag: readOnly,
    noKeyboard: readOnly,
  });

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const mediaUrl = preview ?? defaultMedia;
  const hasMedia = !!mediaUrl;
  const isVideo = preview
    ? previewType === "video"
    : defaultMedia
      ? isVideoUrl(defaultMedia, defaultMediaType)
      : false;

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <p className="text-muted-foreground mb-2 text-sm font-medium">
          {label}
        </p>
      )}

      <div
        {...getRootProps()}
        className={clsx(
          "group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors",
          aspectRatioClasses[aspectRatio],
          disabled && "cursor-not-allowed opacity-50",
          readOnly ? "cursor-default" : "cursor-pointer",
          error
            ? "border-destructive bg-destructive/5"
            : isDragActive
              ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20"
              : "border-border bg-muted",
        )}
      >
        <input {...getInputProps()} />

        {/* Media layer */}
        {hasMedia &&
          (isVideo ? (
            <video
              src={mediaUrl}
              className="absolute inset-0 h-full w-full object-cover"
              controls
              muted
              autoPlay
              loop
              playsInline
            />
          ) : (
            <Image
              src={mediaUrl}
              alt="Uploaded media"
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ))}

        {/* Upload overlay - hidden when readOnly with media */}
        {!(readOnly && hasMedia) && (
          <div
            className={clsx(
              "absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 transition-opacity",
              hasMedia
                ? "bg-background/80 opacity-0 backdrop-blur-sm group-hover:opacity-100"
                : "opacity-100",
            )}
          >
            <div
              className={clsx(
                "flex size-12 items-center justify-center rounded-lg",
                isDragActive ? "bg-amber-100 dark:bg-amber-900" : "bg-muted",
              )}
            >
              <Upload
                className={clsx(
                  "size-6",
                  isDragActive ? "text-amber-500" : "text-muted-foreground",
                )}
              />
            </div>

            <div className="text-center">
              <p className="text-foreground text-base font-medium">
                {isDragActive
                  ? "Drop your media here"
                  : "Drag and drop your media here"}
              </p>
              {showBrowseButton && (
                <p className="text-muted-foreground mt-1 text-sm">or</p>
              )}
            </div>

            {showBrowseButton && (
              <button
                type="button"
                className={clsx(
                  "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                  "border-amber-400 text-amber-500",
                  "hover:bg-amber-50 dark:hover:bg-amber-950",
                  "focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none",
                )}
                onClick={(e) => e.stopPropagation()}
              >
                Browse Media
              </button>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default CardMediaUpload;
