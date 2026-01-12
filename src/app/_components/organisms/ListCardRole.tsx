import React from "react";
import clsx from "clsx";
import CardRole from "../molecules/CardRole";
import type { CardRoleProps } from "../molecules/CardRole";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";

export type ListCardRoleProps = {
  className?: string;
  loading?: boolean;
  roles: CardRoleProps[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  title?: string;
  onEditRole?: (role: CardRoleProps, index: number) => void;
  onCopyRole?: (role: CardRoleProps, index: number) => void;
};

const ListCardRole: React.FC<ListCardRoleProps> = ({
  className,
  loading = false,
  roles,
  emptyStateTitle = "No roles found",
  emptyStateDescription = "Create a role to start managing permissions.",
  title,
  onEditRole,
  onCopyRole,
}) => {
  return (
    <div className={clsx("flex flex-col", className)}>
      {/* Header */}
      {title && (
        <h2 className="text-foreground mb-4 text-xl font-semibold">{title}</h2>
      )}

      <WrapperLoader loading={loading} totalDocs={roles.length}>
        {/* Content */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => (
            <CardRole
              key={role.roleName + index}
              {...role}
              onEditRole={
                onEditRole ? () => onEditRole(role, index) : role.onEditRole
              }
              onCopy={onCopyRole ? () => onCopyRole(role, index) : role.onCopy}
            />
          ))}
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-muted flex animate-pulse flex-col gap-3 rounded-xl p-4"
            >
              {/* Top row skeleton */}
              <div className="flex items-center justify-between">
                <div className="bg-muted-foreground/20 h-4 w-20 rounded" />
                <div className="flex -space-x-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-muted-foreground/20 size-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
              </div>

              {/* Bottom row skeleton */}
              <div className="mt-3 flex items-end justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="bg-muted-foreground/20 h-5 w-28 rounded" />
                  <div className="bg-muted-foreground/20 h-4 w-16 rounded" />
                </div>
                <div className="bg-muted-foreground/20 size-5 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <CardEmptyState
          title={emptyStateTitle}
          description={emptyStateDescription}
        />
      </WrapperLoader>
    </div>
  );
};

export default ListCardRole;
