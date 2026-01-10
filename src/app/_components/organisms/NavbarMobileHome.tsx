"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { TouchTarget } from "../atoms/button";
import { mobileNavigation } from "@/lib/constants";

export type NavbarMobileHomeProps = {
  className?: string;
};

/**
 * NavbarMobileHome - Mobile-first bottom navigation bar component
 *
 * A mobile navigation component featuring:
 * - Fixed bottom positioning with 5 key navigation items
 * - Active state indicator (top border)
 * - Icon + label design pattern
 * - Automatic current path detection
 *
 * Uses semantic colors that automatically adapt to light/dark themes.
 */
export const NavbarMobileHome = forwardRef<
  HTMLElement,
  NavbarMobileHomeProps & Omit<ComponentPropsWithoutRef<"nav">, "children">
>(function NavbarMobileHome({ className, ...props }, ref) {
  const pathname = usePathname();

  return (
    <nav
      ref={ref}
      className={clsx(
        "border-border bg-card",
        "border-t",
        "shadow-lg",
        "pb-safe",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-around">
        {mobileNavigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "relative flex flex-1 flex-col items-center justify-center gap-1",
                "px-2 py-3",
                "transition-colors duration-200",
                "hover:bg-muted/50 active:bg-muted",
                "focus-visible:ring-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-inset",
              )}
            >
              {isActive && (
                <span
                  className="bg-primary absolute top-0 right-0 left-0 h-0.5"
                  aria-hidden="true"
                />
              )}

              <TouchTarget>
                <Icon
                  className={clsx(
                    "h-6 w-6 transition-colors duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                  aria-hidden="true"
                />

                <span
                  className={clsx(
                    "text-xs font-medium transition-colors duration-200",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </span>
              </TouchTarget>

              {isActive && <span className="sr-only">(current page)</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

export default NavbarMobileHome;
