"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import * as Headless from "@headlessui/react";
import { PanelLeft, PanelLeftClose, ChevronDown } from "lucide-react";
import Logo from "../atoms/logo";
import { Link } from "../atoms/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarSection,
  SidebarItem,
  SidebarLabel,
  SidebarHeading,
} from "../atoms/sidebar";
import {
  dashboardNavigation,
  dashboardToolsNavigation,
  type DashboardNavItem,
  type DashboardNavChild,
} from "@/lib/dashboard-navigation";

export type SidebarDashboardProps = {
  /** Default expanded sections by name */
  defaultExpandedSections?: string[];
};

/**
 * SidebarDashboard - Admin dashboard navigation sidebar component
 *
 * A collapsible sidebar component for admin/dashboard navigation featuring:
 * - Logo header with collapse/expand toggle
 * - Main dashboard link
 * - Collapsible tool sections (Roles, Users, Characters, etc.)
 * - Multi-expand capability (multiple sections can be open)
 * - Smooth animations using framer-motion
 * - Automatic current path detection using usePathname
 *
 * Uses semantic sidebar colors that automatically adapt to light/dark themes.
 */
export const SidebarDashboard: React.FC<SidebarDashboardProps> = ({
  defaultExpandedSections = [],
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(defaultExpandedSections),
  );
  const pathname = usePathname();

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  };

  const isChildActive = (
    children: DashboardNavChild[] | undefined,
  ): boolean => {
    if (!children) return false;
    return children.some(
      (child) =>
        pathname === child.href || pathname.startsWith(child.href + "/"),
    );
  };

  const isSectionActive = (item: DashboardNavItem): boolean => {
    if (item.href) {
      return pathname === item.href || pathname.startsWith(item.href + "/");
    }
    return isChildActive(item.children);
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
                  <Logo href="/dashboard" size="sm" withText />
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
          {/* Main Dashboard Navigation */}
          <SidebarSection>
            {dashboardNavigation.map((item) => {
              const isCurrent = item.href
                ? pathname === item.href
                : isChildActive(item.children);

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

          {/* Tools Section */}
          <SidebarSection>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SidebarHeading>Tools</SidebarHeading>
                </motion.div>
              )}
            </AnimatePresence>

            {dashboardToolsNavigation.map((item) => {
              const isExpanded = expandedSections.has(item.name);
              const sectionActive = isSectionActive(item);

              return (
                <div key={item.name}>
                  {/* Collapsible Section Header */}
                  <Headless.Button
                    onClick={() => toggleSection(item.name)}
                    className={clsx(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium sm:py-2 sm:text-sm/5",
                      "text-sidebar-foreground",
                      "hover:bg-sidebar-accent",
                      sectionActive && "bg-sidebar-accent",
                    )}
                  >
                    <item.icon
                      className={clsx(
                        "h-5 w-5 shrink-0",
                        sectionActive
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/60",
                      )}
                    />
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-1 items-center justify-between"
                        >
                          <SidebarLabel>{item.name}</SidebarLabel>
                          <ChevronDown
                            className={clsx(
                              "h-4 w-4 shrink-0 transition-transform duration-200",
                              isExpanded && "rotate-180",
                            )}
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Headless.Button>

                  {/* Collapsible Children */}
                  <AnimatePresence initial={false}>
                    {isExpanded && !isCollapsed && item.children && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-sidebar-border ml-4 border-l pt-1 pl-3">
                          {item.children.map((child) => {
                            const isChildCurrent =
                              pathname === child.href ||
                              pathname.startsWith(child.href + "/");

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={clsx(
                                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                                  "transition-colors",
                                  isChildCurrent
                                    ? "text-sidebar-primary font-medium"
                                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                                )}
                              >
                                <span
                                  className={clsx(
                                    "h-1.5 w-1.5 rounded-full",
                                    isChildCurrent
                                      ? "bg-sidebar-primary"
                                      : "border-sidebar-foreground/40 border",
                                  )}
                                />
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </SidebarSection>
        </SidebarBody>
      </Sidebar>
    </motion.div>
  );
};

export default SidebarDashboard;
