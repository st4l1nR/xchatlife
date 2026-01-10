"use client";

import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { Video } from "lucide-react";

export type CardGeneratedImageProps = {
  className?: string;
  id: string;
  src: string;
  alt?: string;
  canBeVideo?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
};

const CardGeneratedImage: React.FC<CardGeneratedImageProps> = ({
  className,
  id: _id,
  src,
  alt = "Generated image",
  canBeVideo = false,
  isLoading = false,
  onClick,
}) => {
  if (isLoading) {
    return (
      <div
        className={clsx(
          "bg-muted aspect-[3/4] w-full animate-pulse rounded-xl",
          className,
        )}
      >
        <div className="flex h-full items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group bg-muted hover:ring-border relative aspect-[3/4] w-full overflow-hidden rounded-xl transition-all hover:ring-2",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
      />

      {/* AI Video badge */}
      {canBeVideo && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Video className="size-3" />
          AI Video
        </div>
      )}
    </button>
  );
};

export default CardGeneratedImage;
