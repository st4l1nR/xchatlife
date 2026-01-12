import React from "react";
import clsx from "clsx";
import SnackActivity from "../molecules/SnackActivity";
import type { SnackActivityProps } from "../molecules/SnackActivity";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";

export type ListSnackActivityProps = {
  className?: string;
  loading?: boolean;
  activities: SnackActivityProps[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  title?: string;
  onSelectActivity?: (activity: SnackActivityProps, index: number) => void;
};

const ListSnackActivity: React.FC<ListSnackActivityProps> = ({
  className,
  loading = false,
  activities,
  emptyStateTitle = "No activity",
  emptyStateDescription = "Your activity history will appear here.",
  title,
  onSelectActivity,
}) => {
  return (
    <div className={clsx("flex flex-col", className)}>
      {/* Header */}
      {title && (
        <h2 className="text-foreground mb-4 text-xl font-semibold">{title}</h2>
      )}

      <WrapperLoader loading={loading} totalDocs={activities.length}>
        {/* Content */}
        <div className="flex flex-col">
          {activities.map((activity, index) => (
            <SnackActivity
              key={activity.id ?? index}
              {...activity}
              showTimelineLine={index < activities.length - 1}
              onClick={
                onSelectActivity
                  ? () => onSelectActivity(activity, index)
                  : activity.onClick
              }
            />
          ))}
        </div>

        {/* Loading skeleton */}
        <div className="flex flex-col">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex animate-pulse gap-4 pb-6">
              {/* Timeline indicator skeleton */}
              <div className="flex w-2.5 flex-col items-center pt-1">
                <div className="bg-muted-foreground/20 size-2.5 shrink-0 rounded-full" />
                {index < 4 && (
                  <div className="bg-muted-foreground/20 mt-1 w-px flex-1" />
                )}
              </div>

              {/* Content skeleton */}
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="bg-muted-foreground/20 h-4 w-32 rounded" />
                  <div className="bg-muted-foreground/20 h-3 w-16 rounded" />
                </div>
                <div className="bg-muted-foreground/20 h-3.5 w-48 rounded" />
                {/* Random avatar skeleton for some items */}
                {index % 2 === 0 && (
                  <div className="mt-1 flex items-center gap-3">
                    <div className="bg-muted-foreground/20 size-10 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <div className="bg-muted-foreground/20 h-3.5 w-20 rounded" />
                      <div className="bg-muted-foreground/20 h-3 w-12 rounded" />
                    </div>
                  </div>
                )}
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

export default ListSnackActivity;
