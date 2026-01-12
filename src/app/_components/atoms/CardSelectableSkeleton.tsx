"use client";

import React from "react";
import clsx from "clsx";

export type CardSelectableSkeletonProps = {
  className?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
  size?: "sm" | "md" | "lg";
  count?: number;
};

const aspectRatioClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

const sizeClasses = {
  sm: "min-w-24",
  md: "min-w-32",
  lg: "min-w-48",
};

const CardSelectableSkeleton: React.FC<CardSelectableSkeletonProps> = ({
  className,
  aspectRatio = "portrait",
  size = "md",
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            "relative flex-shrink-0 overflow-hidden rounded-xl",
            "bg-muted animate-pulse",
            aspectRatioClasses[aspectRatio],
            sizeClasses[size],
            className,
          )}
        >
          {/* Gradient overlay placeholder */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Label placeholder */}
          <div className="absolute right-0 bottom-0 left-0 p-3">
            <div className="bg-muted-foreground/20 h-4 w-16 rounded" />
          </div>
        </div>
      ))}
    </>
  );
};

export default CardSelectableSkeleton;
