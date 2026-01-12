import React from "react";
import clsx from "clsx";
import { Copy } from "lucide-react";
import { Avatar } from "../atoms/avatar";
import { Link } from "../atoms/link";

export type CardRoleUser = {
  id: string;
  name: string;
  avatarSrc?: string;
};

export type CardRoleProps = {
  className?: string;
  roleName: string;
  totalUsers: number;
  users: CardRoleUser[];
  maxVisibleAvatars?: number;
  onEditRole?: () => void;
  onCopy?: () => void;
  editRoleHref?: string;
};

const CardRole: React.FC<CardRoleProps> = ({
  className,
  roleName,
  totalUsers,
  users,
  maxVisibleAvatars = 3,
  onEditRole,
  onCopy,
  editRoleHref,
}) => {
  const visibleUsers = users.slice(0, maxVisibleAvatars);
  const overflowCount = totalUsers - maxVisibleAvatars;
  const hasOverflow = overflowCount > 0;

  return (
    <div
      className={clsx("bg-muted flex flex-col gap-3 rounded-xl p-4", className)}
    >
      {/* Top Row: User count and avatars */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          Total {totalUsers} {totalUsers === 1 ? "user" : "users"}
        </span>

        {/* Stacked Avatars */}
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {visibleUsers.map((user, index) => {
              const isLast = index === visibleUsers.length - 1 && !hasOverflow;
              return (
                <Avatar
                  key={user.id}
                  src={user.avatarSrc}
                  initials={user.name.charAt(0).toUpperCase()}
                  alt={user.name}
                  className={clsx(
                    "size-8 border-2 border-white",
                    isLast && "ring-2 ring-cyan-400",
                  )}
                />
              );
            })}
          </div>

          {/* Overflow indicator */}
          {hasOverflow && (
            <span className="bg-muted-foreground/20 text-muted-foreground ml-1 flex size-8 items-center justify-center rounded-full text-xs font-medium">
              +{overflowCount}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row: Role name, edit link, and copy button */}
      <div className="mt-3 flex items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-foreground text-lg font-semibold">
            {roleName}
          </span>
          {editRoleHref ? (
            <Link
              href={editRoleHref}
              onClick={onEditRole}
              className="text-primary text-sm font-medium hover:underline"
            >
              Edit Role
            </Link>
          ) : (
            <button
              type="button"
              onClick={onEditRole}
              className="text-primary text-left text-sm font-medium hover:underline"
            >
              Edit Role
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onCopy}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`Copy ${roleName}`}
        >
          <Copy className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default CardRole;
