import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";

export function SwitchGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(
        className,
        // Basic groups
        "space-y-3 **:data-[slot=label]:font-normal",
        // With descriptions
        "has-data-[slot=description]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium",
      )}
    />
  );
}

export function SwitchField({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
  return (
    <Headless.Field
      data-slot="field"
      {...props}
      className={clsx(
        className,
        // Base layout
        "grid grid-cols-[1fr_auto] gap-x-8 gap-y-1 sm:grid-cols-[1fr_auto]",
        // Control layout
        "*:data-[slot=control]:col-start-2 *:data-[slot=control]:self-start sm:*:data-[slot=control]:mt-0.5",
        // Label layout
        "*:data-[slot=label]:col-start-1 *:data-[slot=label]:row-start-1",
        // Description layout
        "*:data-[slot=description]:col-start-1 *:data-[slot=description]:row-start-2",
        // With description
        "has-data-[slot=description]:**:data-[slot=label]:font-medium",
      )}
    />
  );
}

const colors = {
  "dark/zinc": [
    "[--switch-bg-ring:var(--color-primary)] [--switch-bg:var(--color-primary)]",
    "[--switch-ring:var(--color-primary)] [--switch-shadow:var(--color-primary)]/10 [--switch:var(--color-primary-foreground)]",
  ],
  "dark/white": [
    "[--switch-bg-ring:var(--color-primary)] [--switch-bg:var(--color-primary)]",
    "[--switch-ring:var(--color-primary)] [--switch-shadow:var(--color-primary)]/10 [--switch:var(--color-primary-foreground)]",
  ],
  dark: [
    "[--switch-bg-ring:var(--color-primary)] [--switch-bg:var(--color-primary)]",
    "[--switch-ring:var(--color-primary)] [--switch-shadow:var(--color-primary)]/10 [--switch:var(--color-primary-foreground)]",
  ],
  zinc: [
    "[--switch-bg-ring:var(--color-muted)] [--switch-bg:var(--color-muted)]",
    "[--switch-shadow:var(--color-muted)]/10 [--switch:var(--color-background)] [--switch-ring:var(--color-muted)]",
  ],
  white: [
    "[--switch-bg-ring:var(--color-border)] [--switch-bg:var(--color-background)]",
    "[--switch-shadow:var(--color-foreground)]/10 [--switch-ring:transparent] [--switch:var(--color-foreground)]",
  ],
  red: [
    "[--switch-bg-ring:var(--color-destructive)] [--switch-bg:var(--color-destructive)]",
    "[--switch:var(--color-destructive-foreground)] [--switch-ring:var(--color-destructive)] [--switch-shadow:var(--color-destructive)]/20",
  ],
  orange: [
    "[--switch-bg-ring:var(--color-orange-600)]/90 [--switch-bg:var(--color-orange-500)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:var(--color-orange-600)]/90 [--switch-shadow:var(--color-orange-900)]/20",
  ],
  amber: [
    "[--switch-bg-ring:var(--color-amber-500)]/80 [--switch-bg:var(--color-amber-400)] dark:[--switch-bg-ring:transparent]",
    "[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-amber-950)]",
  ],
  yellow: [
    "[--switch-bg-ring:var(--color-yellow-400)]/80 [--switch-bg:var(--color-yellow-300)] dark:[--switch-bg-ring:transparent]",
    "[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-yellow-950)]",
  ],
  lime: [
    "[--switch-bg-ring:var(--color-lime-400)]/80 [--switch-bg:var(--color-lime-300)] dark:[--switch-bg-ring:transparent]",
    "[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-lime-950)]",
  ],
  green: [
    "[--switch-bg-ring:var(--color-green-700)]/90 [--switch-bg:var(--color-green-600)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:var(--color-green-700)]/90 [--switch-shadow:var(--color-green-900)]/20",
  ],
  emerald: [
    "[--switch-bg-ring:var(--color-emerald-600)]/90 [--switch-bg:var(--color-emerald-500)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:var(--color-emerald-600)]/90 [--switch-shadow:var(--color-emerald-900)]/20",
  ],
  teal: [
    "[--switch-bg-ring:var(--color-teal-700)]/90 [--switch-bg:var(--color-teal-600)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:var(--color-teal-700)]/90 [--switch-shadow:var(--color-teal-900)]/20",
  ],
  cyan: [
    "[--switch-bg-ring:var(--color-cyan-400)]/80 [--switch-bg:var(--color-cyan-300)] dark:[--switch-bg-ring:transparent]",
    "[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:var(--color-cyan-950)]",
  ],
  sky: [
    "[--switch-bg-ring:var(--color-sky-600)]/80 [--switch-bg:var(--color-sky-500)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:var(--color-sky-600)]/80 [--switch-shadow:var(--color-sky-900)]/20",
  ],
  blue: [
    "[--switch-bg-ring:var(--color-primary)] [--switch-bg:var(--color-primary)]",
    "[--switch:var(--color-primary-foreground)] [--switch-ring:var(--color-primary)] [--switch-shadow:var(--color-primary)]/20",
  ],
  indigo: [
    "[--switch-bg-ring:var(--color-indigo-600)]/90 [--switch-bg:var(--color-indigo-500)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:var(--color-indigo-600)]/90 [--switch-shadow:var(--color-indigo-900)]/20",
  ],
  violet: [
    "[--switch-bg-ring:var(--color-violet-600)]/90 [--switch-bg:var(--color-violet-500)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:var(--color-violet-600)]/90 [--switch-shadow:var(--color-violet-900)]/20",
  ],
  purple: [
    "[--switch-bg-ring:var(--color-purple-600)]/90 [--switch-bg:var(--color-purple-500)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:var(--color-purple-600)]/90 [--switch-shadow:var(--color-purple-900)]/20",
  ],
  fuchsia: [
    "[--switch-bg-ring:var(--color-fuchsia-600)]/90 [--switch-bg:var(--color-fuchsia-500)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:var(--color-fuchsia-600)]/90 [--switch-shadow:var(--color-fuchsia-900)]/20",
  ],
  pink: [
    "[--switch-bg-ring:var(--color-pink-600)]/90 [--switch-bg:var(--color-pink-500)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:var(--color-pink-600)]/90 [--switch-shadow:var(--color-pink-900)]/20",
  ],
  rose: [
    "[--switch-bg-ring:var(--color-rose-600)]/90 [--switch-bg:var(--color-rose-500)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:var(--color-rose-600)]/90 [--switch-shadow:var(--color-rose-900)]/20",
  ],
};

type Color = keyof typeof colors;

export function Switch({
  color = "dark/zinc",
  className,
  ...props
}: {
  color?: Color;
  className?: string;
} & Omit<Headless.SwitchProps, "as" | "className" | "children">) {
  return (
    <Headless.Switch
      data-slot="control"
      {...props}
      className={clsx(
        className,
        // Base styles
        "group relative isolate inline-flex h-6 w-10 cursor-default rounded-full p-[3px] sm:h-5 sm:w-8",
        // Transitions
        "transition duration-0 ease-in-out data-changing:duration-200",
        // Outline and background color in forced-colors mode so switch is still visible
        "forced-colors:outline forced-colors:[--switch-bg:Highlight]",
        // Unchecked
        "bg-secondary ring-border ring-1 ring-inset",
        // Checked
        "data-checked:bg-(--switch-bg) data-checked:ring-(--switch-bg-ring)",
        // Focus
        "data-focus:outline-ring focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2",
        // Hover
        "data-hover:ring-border data-hover:data-checked:ring-(--switch-bg-ring)",
        // Disabled
        "data-disabled:bg-muted data-disabled:data-checked:bg-muted data-disabled:data-checked:ring-border data-disabled:opacity-50",
        // Color specific styles
        colors[color],
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          // Basic layout
          "pointer-events-none relative inline-block size-4.5 rounded-full sm:size-3.5",
          // Transition
          "translate-x-0 transition duration-200 ease-in-out",
          // Invisible border so the switch is still visible in forced-colors mode
          "border border-transparent",
          // Unchecked
          "bg-white shadow-sm",
          // Checked
          "group-data-checked:bg-(--switch) group-data-checked:shadow-(--switch-shadow) group-data-checked:ring-1 group-data-checked:ring-(--switch-ring)",
          "group-data-checked:translate-x-4 sm:group-data-checked:translate-x-3",
          // Disabled
          "group-data-checked:group-data-disabled:ring-border group-data-checked:group-data-disabled:bg-white group-data-checked:group-data-disabled:shadow-sm group-data-checked:group-data-disabled:ring-1",
        )}
      />
    </Headless.Switch>
  );
}
