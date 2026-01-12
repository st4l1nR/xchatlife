"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Users2,
  Settings,
} from "lucide-react";
import { TouchTarget } from "../atoms/button";

const DASHBOARD_MOBILE_NAV = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Roles", href: "/dashboard/roles", icon: ShieldCheck },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Characters", href: "/dashboard/characters", icon: Users2 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export type NavbarMobileDashboardProps = {
  className?: string;
};

/**
 * NavbarMobileDashboard - Mobile bottom navigation bar for dashboard pages
 *
 * A mobile navigation component featuring:
 * - Fixed bottom positioning with 5 key dashboard navigation items
 * - Active state indicator (top border)
 * - Icon + label design pattern
 * - Automatic current path detection
 *
 * Uses semantic colors that automatically adapt to light/dark themes.
 */
export const NavbarMobileDashboard = forwardRef<
  HTMLElement,
  NavbarMobileDashboardProps & Omit<ComponentPropsWithoutRef<"nav">, "children">
>(function NavbarMobileDashboard({ className, ...props }, ref) {
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

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
        {DASHBOARD_MOBILE_NAV.map((item) => {
          const isActive = isActiveRoute(item.href);
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

export default NavbarMobileDashboard;
