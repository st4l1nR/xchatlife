"use client";

import React, { useState, useRef } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  arrow,
  type Placement,
} from "@floating-ui/react";
import clsx from "clsx";

export type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: Placement;
  className?: string;
  delay?: number;
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  className,
  delay = 200,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const {
    refs,
    floatingStyles,
    context,
    middlewareData,
    placement: actualPlacement,
  } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({
        fallbackAxisSideDirection: "start",
        crossAxis: false,
      }),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
  });

  const hover = useHover(context, {
    delay: { open: delay, close: 0 },
    move: false,
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  // Calculate arrow position based on actual placement
  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[actualPlacement.split("-")[0] ?? "top"] as
    | "top"
    | "right"
    | "bottom"
    | "left";

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className="inline-block"
      >
        {children}
      </span>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={clsx(
              "bg-popover text-popover-foreground z-50 rounded-md px-3 py-1.5 text-sm shadow-md",
              className,
            )}
          >
            {content}
            <div
              ref={arrowRef}
              className="bg-popover absolute size-2 rotate-45"
              style={{
                left: arrowX != null ? `${arrowX}px` : "",
                top: arrowY != null ? `${arrowY}px` : "",
                [staticSide]: "-4px",
              }}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default Tooltip;
