import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { Avatar } from "../atoms/avatar";

export type ActivityCategory =
  | "chat" // Purple - Chat & Messaging
  | "content" // Green - Content Creation
  | "media" // Blue - Media & Collections
  | "subscription" // Amber - Subscription & Billing
  | "support" // Orange - Support & Tickets
  | "affiliate" // Pink - Affiliate & Referrals
  | "account" // Slate - Account & Security
  | "milestone"; // Yellow - Milestones & Achievements

export type ActivityMedia = {
  type: "avatar" | "image";
  src?: string;
  alt?: string;
  label?: string; // Character name, file name, etc.
  sublabel?: string; // "Spicy", file size, etc.
};

export type SnackActivityProps = {
  className?: string;
  id?: string;
  category: ActivityCategory;
  title: string;
  description?: string;
  timestamp: string;
  media?: ActivityMedia[];
  overflowCount?: number;
  badge?: string;
  badgeIcon?: React.ReactNode;
  onClick?: () => void;
  showTimelineLine?: boolean;
};

const categoryColors: Record<ActivityCategory, string> = {
  chat: "bg-purple-500",
  content: "bg-green-500",
  media: "bg-blue-500",
  subscription: "bg-amber-500",
  support: "bg-orange-500",
  affiliate: "bg-pink-500",
  account: "bg-slate-500",
  milestone: "bg-yellow-500",
};

const SnackActivity: React.FC<SnackActivityProps> = ({
  className,
  category,
  title,
  description,
  timestamp,
  media,
  overflowCount,
  badge,
  badgeIcon,
  onClick,
  showTimelineLine = true,
}) => {
  const hasAvatarMedia =
    media && media.length === 1 && media[0]?.type === "avatar";
  const hasImageMedia = media && media.some((m) => m.type === "image");
  const hasMultipleAvatars =
    media && media.length > 1 && media.every((m) => m.type === "avatar");

  return (
    <div
      className={clsx(
        "relative flex gap-4 pb-3",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Timeline indicator */}
      <div className="relative flex w-2.5 flex-col items-center pt-1">
        {/* Colored dot */}
        <div
          className={clsx(
            "z-10 size-2.5 shrink-0 rounded-full",
            categoryColors[category],
          )}
        />
        {/* Connecting line */}
        {showTimelineLine && <div className="bg-border mt-1 w-px flex-1" />}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-foreground text-sm font-medium">{title}</span>
          <span className="text-muted-foreground shrink-0 text-xs">
            {timestamp}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}

        {/* Single avatar with label */}
        {hasAvatarMedia && media[0] && (
          <div className="mt-1 flex items-center gap-3">
            <Avatar
              src={media[0].src}
              alt={media[0].alt ?? media[0].label ?? ""}
              initials={media[0].label?.charAt(0).toUpperCase()}
              className="size-10"
            />
            {(media[0].label || media[0].sublabel) && (
              <div className="flex flex-col">
                {media[0].label && (
                  <span className="text-foreground text-sm font-medium">
                    {media[0].label}
                  </span>
                )}
                {media[0].sublabel && (
                  <span className="text-muted-foreground text-xs">
                    {media[0].sublabel}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Multiple avatars (stacked) */}
        {hasMultipleAvatars && (
          <div className="mt-1 flex items-center">
            <div className="flex -space-x-2">
              {media.slice(0, 3).map((item, index) => (
                <Avatar
                  key={index}
                  src={item.src}
                  alt={item.alt ?? item.label ?? ""}
                  initials={item.label?.charAt(0).toUpperCase()}
                  className="border-background size-8 border-2"
                />
              ))}
            </div>
            {(overflowCount ?? 0) > 0 && (
              <span className="bg-muted-foreground/20 text-muted-foreground ml-1 flex size-8 items-center justify-center rounded-full text-xs font-medium">
                +{overflowCount}
              </span>
            )}
          </div>
        )}

        {/* Image grid */}
        {hasImageMedia && (
          <div className="mt-1 flex items-center gap-1">
            {media
              .filter((m) => m.type === "image")
              .slice(0, 3)
              .map((item, index) => (
                <div
                  key={index}
                  className="relative size-12 shrink-0 overflow-hidden rounded-lg"
                >
                  {item.src ? (
                    <Image
                      src={item.src}
                      alt={item.alt ?? ""}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-muted size-full" />
                  )}
                </div>
              ))}
            {(overflowCount ?? 0) > 0 && (
              <span className="bg-muted-foreground/20 text-muted-foreground flex size-12 items-center justify-center rounded-lg text-xs font-medium">
                +{overflowCount}
              </span>
            )}
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div className="mt-1 flex items-center gap-1.5">
            {badgeIcon && (
              <span className="text-muted-foreground">{badgeIcon}</span>
            )}
            <span className="text-muted-foreground text-xs">{badge}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnackActivity;
