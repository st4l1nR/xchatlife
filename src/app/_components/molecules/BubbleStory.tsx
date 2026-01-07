import React from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

export type BubbleStoryProps = {
  className?: string;
  name: string;
  src: string;
  href: string;
  isRead?: boolean;
  size?: "sm" | "md" | "lg";
  alt?: string;
};

const sizes = {
  sm: {
    container: "size-12", // 48px
    imageSize: 48,
    border: "border-2",
    text: "text-xs",
    maxWidth: "max-w-14",
  },
  md: {
    container: "size-16", // 64px
    imageSize: 64,
    border: "border-[3px]",
    text: "text-sm",
    maxWidth: "max-w-18",
  },
  lg: {
    container: "size-20", // 80px
    imageSize: 80,
    border: "border-4",
    text: "text-base",
    maxWidth: "max-w-22",
  },
};

const BubbleStory: React.FC<BubbleStoryProps> = ({
  className,
  name,
  src,
  href,
  isRead = false,
  size = "md",
  alt,
}) => {
  const sizeStyles = sizes[size];

  return (
    <Link
      href={href}
      className={clsx("group flex flex-col items-center gap-1.5", className)}
      aria-label={`View ${name}'s story`}
    >
      {/* Border ring container */}
      <div
        className={clsx(
          "rounded-full p-0.5 transition-transform duration-200 group-hover:scale-105",
          sizeStyles.border,
          isRead ? "border-muted-foreground/30" : "border-primary",
        )}
      >
        {/* Image container */}
        <div
          className={clsx(
            "bg-muted overflow-hidden rounded-full",
            sizeStyles.container,
          )}
        >
          <Image
            src={src}
            alt={alt ?? name}
            width={sizeStyles.imageSize}
            height={sizeStyles.imageSize}
            className="size-full object-cover"
          />
        </div>
      </div>

      {/* Name label */}
      <span
        className={clsx(
          "text-foreground truncate text-center",
          sizeStyles.text,
          sizeStyles.maxWidth,
        )}
      >
        {name}
      </span>
    </Link>
  );
};

export default BubbleStory;
