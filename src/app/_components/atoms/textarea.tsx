import * as Headless from "@headlessui/react";
import clsx from "clsx";
import React, { forwardRef } from "react";

export const Textarea = forwardRef(function Textarea(
  {
    className,
    resizable = true,
    ...props
  }: { className?: string; resizable?: boolean } & Omit<
    Headless.TextareaProps,
    "as" | "className"
  >,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
  return (
    <span
      data-slot="control"
      className={clsx([
        className,
        // Basic layout
        "relative block w-full",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:bg-background before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-sm",
        // Focus ring
        "sm:focus-within:after:ring-ring after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2",
        // Disabled state
        "has-data-disabled:before:bg-muted has-data-disabled:opacity-50 has-data-disabled:before:shadow-none",
      ])}
    >
      <Headless.Textarea
        ref={ref}
        {...props}
        className={clsx([
          // Basic layout
          "relative block h-full w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
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
          "disabled:border-border disabled:bg-muted disabled:data-hover:border-border",
          // Resizable
          resizable ? "resize-y" : "resize-none",
        ])}
      />
    </span>
  );
});
