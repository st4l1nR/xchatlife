import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { useEffect, useState } from "react";
import { Text } from "./text";

const sizes = {
  xs: "sm:max-w-xs",
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  "6xl": "sm:max-w-6xl",
};

export function Dialog({
  size = "lg",
  className,
  children,
  sidebarOffset = false,
  containerRef,
  ...props
}: {
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
  sidebarOffset?: boolean;
  containerRef?: React.RefObject<HTMLElement | null>;
} & Omit<Headless.DialogProps, "as" | "className">) {
  const [containerBounds, setContainerBounds] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile (sm breakpoint is 640px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    // Don't apply containerRef bounds on mobile
    if (!containerRef?.current || !props.open || isMobile) {
      setContainerBounds(null);
      return;
    }

    const updateBounds = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setContainerBounds({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateBounds();

    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(containerRef.current);

    window.addEventListener("resize", updateBounds);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateBounds);
    };
  }, [containerRef, props.open, isMobile]);

  const containerStyle = containerBounds
    ? {
        left: `${containerBounds.left}px`,
        top: `${containerBounds.top}px`,
        width: `${containerBounds.width}px`,
        height: `${containerBounds.height}px`,
      }
    : undefined;

  return (
    <Headless.Dialog {...props}>
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 z-50 flex w-screen justify-center overflow-y-auto bg-black/60 px-2 py-2 transition duration-100 focus:outline-0 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in sm:px-6 sm:py-8 lg:px-8 lg:py-16"
      />

      <div
        className={clsx(
          "fixed z-50 overflow-y-auto pt-6 sm:pt-0",
          !containerBounds && "inset-0 w-screen",
          !containerBounds && sidebarOffset && "lg:left-64",
        )}
        style={containerBounds ? containerStyle : undefined}
      >
        <div
          className={clsx("flex min-h-full items-center justify-center sm:p-4")}
          style={
            containerBounds
              ? {
                  paddingTop: containerBounds.height * 0.1,
                  paddingBottom: containerBounds.height * 0.1,
                }
              : undefined
          }
        >
          <Headless.DialogPanel
            transition
            className={clsx(
              className,
              sizes[size],
              "bg-background text-foreground ring-border w-full min-w-0 rounded-t-3xl p-(--gutter) shadow-lg ring-1 [--gutter:--spacing(8)] sm:rounded-2xl forced-colors:outline",
              "transition duration-100 will-change-transform data-closed:translate-y-12 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in sm:data-closed:translate-y-0 sm:data-closed:data-enter:scale-95",
            )}
          >
            {children}
          </Headless.DialogPanel>
        </div>
      </div>
    </Headless.Dialog>
  );
}

export function DialogTitle({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DialogTitleProps,
  "as" | "className"
>) {
  return (
    <Headless.DialogTitle
      {...props}
      className={clsx(
        className,
        "text-foreground text-lg/6 font-semibold text-balance sm:text-base/6",
      )}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DescriptionProps<typeof Text>,
  "as" | "className"
>) {
  return (
    <Headless.Description
      as={Text}
      {...props}
      className={clsx(className, "mt-2 text-pretty")}
    />
  );
}

export function DialogBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={clsx(className, "mt-6")} />;
}

export function DialogActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto",
      )}
    />
  );
}
