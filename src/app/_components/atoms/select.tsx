import * as Headless from "@headlessui/react";
import clsx from "clsx";
import React, { forwardRef } from "react";

export const Select = forwardRef(function Select(
  {
    className,
    multiple,
    ...props
  }: { className?: string } & Omit<Headless.SelectProps, "as" | "className">,
  ref: React.ForwardedRef<HTMLSelectElement>,
) {
  return (
    <span
      data-slot="control"
      className={clsx([
        className,
        // Basic layout
        "group relative block w-full",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:bg-background before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-sm",
        // Focus ring
        "has-data-focus:after:ring-ring after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset has-data-focus:after:ring-2",
        // Disabled state
        "has-data-disabled:before:bg-muted has-data-disabled:opacity-50 has-data-disabled:before:shadow-none",
      ])}
    >
      <Headless.Select
        ref={ref}
        multiple={multiple}
        {...props}
        className={clsx([
          // Basic layout
          "relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
          // Horizontal padding
          multiple
            ? "px-[calc(--spacing(3.5)-1px)] sm:px-[calc(--spacing(3)-1px)]"
            : "pr-[calc(--spacing(10)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pr-[calc(--spacing(9)-1px)] sm:pl-[calc(--spacing(3)-1px)]",
          // Options (multi-select)
          "[&_optgroup]:font-semibold",
          // Typography
          "text-foreground placeholder:text-muted-foreground text-base/6 sm:text-sm/6",
          // Border
          "border-foreground/20 data-hover:border-foreground/30 border",
          // Background color
          "bg-input",
          // Hide default focus styles
          "focus:outline-hidden",
          // Invalid state
          "data-invalid:border-destructive data-invalid:data-hover:border-destructive",
          // Disabled state
          "data-disabled:border-border data-disabled:bg-muted data-hover:data-disabled:border-border data-disabled:opacity-100",
        ])}
      />
      {!multiple && (
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="stroke-muted-foreground group-has-data-disabled:stroke-muted-foreground size-5 sm:size-4 forced-colors:stroke-[CanvasText]"
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="none"
          >
            <path
              d="M5.75 10.75L8 13L10.25 10.75"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.25 5.25L8 3L5.75 5.25"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </span>
  );
});
