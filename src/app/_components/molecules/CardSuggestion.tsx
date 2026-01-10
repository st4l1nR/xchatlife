"use client";

import React from "react";
import clsx from "clsx";
import Image from "next/image";

export type CardSuggestionProps = {
  className?: string;
  id: string;
  label: string;
  imageSrc: string;
  selected?: boolean;
  onClick?: () => void;
};

const CardSuggestion: React.FC<CardSuggestionProps> = ({
  className,
  id: _id,
  label,
  imageSrc,
  selected = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group flex flex-col items-center gap-2 transition-all",
        className,
      )}
    >
      {/* Image */}
      <div
        className={clsx(
          "bg-muted relative aspect-[3/4] w-20 overflow-hidden rounded-xl transition-all sm:w-24",
          selected
            ? "ring-primary ring-offset-background ring-2 ring-offset-2"
            : "hover:ring-border ring-1 ring-transparent",
        )}
      >
        <Image
          src={imageSrc}
          alt={label}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="96px"
        />
      </div>

      {/* Label */}
      <span
        className={clsx(
          "text-xs font-medium transition-colors",
          selected ? "text-primary" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default CardSuggestion;
