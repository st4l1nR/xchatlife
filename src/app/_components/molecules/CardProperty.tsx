"use client";

import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { PencilIcon, PlayIcon, TrashIcon } from "@heroicons/react/24/solid";

export type AspectRatio = "16:9" | "4:3" | "1:1" | "3:4" | "9:16";

export type CardPropertyProps = {
  className?: string;
  id: string;
  src: string;
  alt?: string;
  mediaType: "image" | "video";
  aspectRatio?: AspectRatio;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  isLoading?: boolean;
  isDragging?: boolean;
};

const aspectRatioClasses: Record<AspectRatio, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "3:4": "aspect-[3/4]",
  "9:16": "aspect-[9/16]",
};

const CardProperty: React.FC<CardPropertyProps> = ({
  className,
  id,
  src,
  alt = "Property image",
  mediaType,
  aspectRatio = "3:4",
  onEdit,
  onDelete,
  onClick,
  isLoading = false,
  isDragging = false,
}) => {
  if (isLoading) {
    return (
      <div
        className={clsx(
          "bg-muted w-full animate-pulse rounded-xl",
          aspectRatioClasses[aspectRatio],
          className,
        )}
      />
    );
  }

  const isVideo = mediaType === "video";

  return (
    <div
      className={clsx(
        "group relative w-full overflow-hidden rounded-xl",
        aspectRatioClasses[aspectRatio],
        isDragging && "opacity-50",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={() => onClick?.(id)}
    >
      {isVideo ? (
        <video
          src={src}
          className="absolute inset-0 h-full w-full object-cover object-top"
          muted
          loop
          playsInline
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className="object-cover object-top"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        />
      )}

      {isVideo && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <PlayIcon className="size-6 text-white" />
          </div>
        </div>
      )}

      {onEdit && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(id);
          }}
          className="bg-primary absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-lg transition-transform hover:scale-110"
          aria-label="Edit property"
        >
          <PencilIcon className="text-primary-foreground size-4" />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="bg-destructive absolute top-2 left-2 z-10 flex size-8 items-center justify-center rounded-lg opacity-0 transition-all group-hover:opacity-100 hover:scale-110"
          aria-label="Delete property"
        >
          <TrashIcon className="text-destructive-foreground size-4" />
        </button>
      )}

      <div className="ring-primary/50 pointer-events-none absolute inset-0 rounded-xl transition-all group-hover:ring-2" />
    </div>
  );
};

export default CardProperty;
