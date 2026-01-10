"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import Logo from "../atoms/logo";
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarSection,
  SidebarItem,
  SidebarLabel,
  SidebarSpacer,
} from "../atoms/sidebar";
import {
  mainNavigation,
  accountNavigation,
  tokenNavigation,
} from "@/lib/constants";

// Check if a pathname is a home/category route
// Home routes are "/" or any category like "/realistic-girl", "/anime-girl", etc.
function isHomeRoute(pathname: string, otherNavPaths: string[]): boolean {
  if (pathname === "/") return true;

  // Check if pathname starts with any other navigation paths (not home routes)
  const isOtherNavRoute = otherNavPaths.some(
    (navPath) => pathname === navPath || pathname.startsWith(navPath + "/"),
  );

  // If it's not another nav route and it's a top-level path, it's a home/category route
  if (!isOtherNavRoute) {
    // Top-level paths like /realistic-girl, /anime-girl, /realistic-men, /realistic-trans
    const segments = pathname.split("/").filter(Boolean);
    return segments.length === 1;
  }

  return false;
}

export type SidebarHomeProps = {
  hasActiveSubscription?: boolean;
};

/**
 * SidebarHome - Main navigation sidebar component
 *
 * A collapsible sidebar component for app navigation featuring:
 * - Logo header with collapse/expand toggle
 * - Main navigation items (Home, Chats, Matches)
 * - Account section (Profile, Settings)
 * - Token section (Earn tokens, Buy tokens) - only shown with active subscription
 * - Smooth animations using framer-motion
 * - Automatic current path detection using usePathname
 *
 * Uses semantic sidebar colors that automatically adapt to light/dark themes.
 */
export const SidebarHome: React.FC<SidebarHomeProps> = ({
  hasActiveSubscription = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 72 : 280,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="bg-sidebar text-sidebar-foreground border-sidebar-border flex h-full flex-col border-r"
    >
      <Sidebar>
        <SidebarHeader>
          <div
            className={clsx(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-between",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {!isCollapsed && (
                <motion.div
                  key="expanded-logo"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Logo href="/" size="sm" withText />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleCollapseToggle}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md p-1.5 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
          </div>
        </SidebarHeader>

        <SidebarBody>
          <SidebarSection>
            {mainNavigation.map((item) => {
              // For Home item, check if pathname is a home/category route
              // Other nav paths are used to determine what's NOT a home route
              const otherNavPaths = mainNavigation
                .filter((nav) => nav.href !== "/")
                .map((nav) => nav.href);
              const isCurrent =
                item.href === "/"
                  ? isHomeRoute(pathname, otherNavPaths)
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");

              return (
                <SidebarItem
                  key={item.name}
                  href={item.href}
                  current={isCurrent}
                >
                  <item.icon className="h-5 w-5" />
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SidebarLabel>{item.name}</SidebarLabel>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </SidebarItem>
              );
            })}
          </SidebarSection>

          <SidebarSpacer />

          {/* Token Section - only shown with active subscription */}
          {hasActiveSubscription && (
            <SidebarSection>
              {tokenNavigation.map((item) => (
                <SidebarItem
                  key={item.name}
                  href={item.href}
                  current={pathname === item.href}
                >
                  <item.icon className="h-5 w-5" />
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SidebarLabel>{item.name}</SidebarLabel>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </SidebarItem>
              ))}
            </SidebarSection>
          )}

          <SidebarSection>
            {accountNavigation.map((item) => (
              <SidebarItem
                key={item.name}
                href={item.href}
                current={pathname === item.href}
              >
                <item.icon className="h-5 w-5" />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <SidebarLabel>{item.name}</SidebarLabel>
                      {item.badge && (
                        <span className="bg-primary text-primary-foreground rounded px-1.5 py-0.5 text-xs font-medium">
                          {item.badge}
                        </span>
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </SidebarItem>
            ))}
          </SidebarSection>
        </SidebarBody>
      </Sidebar>
    </motion.div>
  );
};

export default SidebarHome;
