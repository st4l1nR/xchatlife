import React from "react";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  text?: string;
  title?: string;
  description?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const CardEmptyState: React.FC<Props> = ({
  className,
  text,
  title,
  description,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "border-border bg-muted focus:ring-ring relative flex h-96 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center focus:ring-2 focus:ring-offset-2 focus:outline-none",
        className,
      )}
      {...props}
    >
      <MagnifyingGlassIcon className="text-muted-foreground mx-auto h-12 w-12" />

      <h3 className="text-foreground mt-4 text-lg font-semibold">
        {title || "No results found"}
      </h3>

      {description && (
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      )}

      {text && (
        <span className="text-muted-foreground mt-2 block text-sm font-semibold">
          {text}
        </span>
      )}
    </div>
  );
};

export default CardEmptyState;
