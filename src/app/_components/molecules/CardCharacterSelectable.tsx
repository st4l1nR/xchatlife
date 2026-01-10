"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";

export type CardCharacterSelectableProps = {
  className?: string;
  // Required
  id: string;
  name: string;
  imageSrc: string;
  // Selection
  selected?: boolean;
  onSelect?: (id: string) => void;
};

const CardCharacterSelectable: React.FC<CardCharacterSelectableProps> = ({
  className,
  id,
  name,
  imageSrc,
  selected = false,
  onSelect,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    onSelect?.(id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        "group bg-muted relative block aspect-[3/4] w-full overflow-hidden rounded-2xl transition-shadow duration-200",
        className,
      )}
      aria-label={`Select ${name}`}
      aria-pressed={selected}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image - scales up on hover */}
      <Image
        src={imageSrc}
        alt={name}
        fill
        unoptimized
        className={clsx(
          "object-cover transition-transform duration-300",
          isHovering && "scale-105",
        )}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Inner ring overlay on hover/selected */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 rounded-2xl border-4 transition-all duration-300",
          selected
            ? "border-primary opacity-100"
            : isHovering
              ? "border-white/30 opacity-100"
              : "border-transparent opacity-0",
        )}
      />

      {/* Name at bottom */}
      <div className="absolute right-0 bottom-0 left-0 p-3 sm:p-5">
        <span
          className={clsx(
            "block rounded-full px-2 py-1 text-center text-xs font-bold text-white transition-all duration-300 sm:px-3 sm:py-1.5 sm:text-sm",
            selected
              ? "bg-primary text-primary-foreground"
              : isHovering
                ? "bg-white/30"
                : "bg-black/30",
          )}
        >
          {name}
        </span>
      </div>
    </button>
  );
};

export default CardCharacterSelectable;
