"use client";

import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { Plus } from "lucide-react";

export type CardSuggestionProps = {
  className?: string;
  id: string;
  label: string;
  imageSrc: string;
  onClick?: () => void;
};

const CardSuggestion: React.FC<CardSuggestionProps> = ({
  className,
  id: _id,
  label,
  imageSrc,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group flex cursor-pointer flex-col items-center gap-2 transition-all",
        className,
      )}
    >
      {/* Image */}
      <div className="bg-muted relative aspect-square w-20 overflow-hidden rounded-xl transition-all sm:w-24">
        <Image
          src={imageSrc}
          alt={label}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="96px"
        />
        {/* Inset border overlay */}
        <div className="ring-border/50 group-hover:ring-border pointer-events-none absolute inset-0 rounded-xl ring-1 transition-all ring-inset" />

        {/* Plus button on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full">
            <Plus className="size-5" />
          </div>
        </div>
      </div>

      {/* Label */}
      <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium transition-colors">
        {label}
      </span>
    </button>
  );
};

export default CardSuggestion;
