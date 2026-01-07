import clsx from "clsx";
import type React from "react";

export function Divider({
  soft = false,
  className,
  children,
  ...props
}: {
  soft?: boolean;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"hr">) {
  if (children) {
    return (
      <div className={clsx("relative", className)}>
        <div className="absolute inset-0 flex items-center">
          <div
            className={clsx(
              "w-full border-t",
              soft && "border-accent/50",
              !soft && "border-accent/70",
            )}
          />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background text-muted-foreground px-2">
            {children}
          </span>
        </div>
      </div>
    );
  }

  return (
    <hr
      role="presentation"
      {...props}
      className={clsx(
        className,
        "w-full border-t",
        soft && "border-accent/50",
        !soft && "border-accent/70",
      )}
    />
  );
}
