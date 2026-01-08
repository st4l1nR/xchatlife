import React from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { RotateCcw, Trash2 } from "lucide-react";

export type SnackChatProps = {
  className?: string;
  id?: string;
  name: string;
  message: string;
  timestamp: string;
  avatarSrc: string;
  avatarAlt?: string;
  href?: string;
  isRead?: boolean;
  showActions?: boolean;
  onReply?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
};

const SnackChat: React.FC<SnackChatProps> = ({
  className,
  name,
  message,
  timestamp,
  avatarSrc,
  avatarAlt,
  href,
  isRead = false,
  showActions = true,
  onReply,
  onDelete,
  onClick,
}) => {
  const isClickable = href || onClick;

  const content = (
    <>
      {/* Avatar */}
      <div className="bg-muted-foreground/20 relative size-10 shrink-0 overflow-hidden rounded-full">
        <Image
          src={avatarSrc}
          alt={avatarAlt ?? name}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={clsx(
              "truncate font-medium",
              isRead ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {name}
          </span>
          <span className="text-muted-foreground shrink-0 text-xs">
            {timestamp}
          </span>
        </div>
        <p
          className={clsx(
            "truncate text-sm",
            isRead ? "text-muted-foreground/70" : "text-muted-foreground",
          )}
        >
          {message}
        </p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReply?.();
            }}
            className="text-muted-foreground hover:text-foreground rounded p-1.5 transition-colors hover:bg-white/10"
            aria-label="Reply"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.();
            }}
            className="text-muted-foreground hover:text-destructive rounded p-1.5 transition-colors hover:bg-white/10"
            aria-label="Delete"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}
    </>
  );

  const containerClasses = clsx(
    "bg-muted flex items-center gap-3 rounded-lg p-3 transition-colors",
    isClickable && "cursor-pointer hover:bg-accent/50",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={containerClasses}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={containerClasses}>
        {content}
      </button>
    );
  }

  return <div className={containerClasses}>{content}</div>;
};

export default SnackChat;
