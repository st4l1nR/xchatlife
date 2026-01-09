"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

export type TooltipProps = {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className,
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-popover border-x-transparent border-b-transparent border-4",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-popover border-x-transparent border-t-transparent border-4",
    left: "left-full top-1/2 -translate-y-1/2 border-l-popover border-y-transparent border-r-transparent border-4",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-popover border-y-transparent border-l-transparent border-4",
  };

  return (
    <div
      className={clsx("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={clsx(
            "bg-popover text-popover-foreground absolute z-50 whitespace-nowrap rounded-md px-3 py-1.5 text-sm shadow-md",
            positionClasses[position],
          )}
          role="tooltip"
        >
          {content}
          <span className={clsx("absolute", arrowClasses[position])} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
