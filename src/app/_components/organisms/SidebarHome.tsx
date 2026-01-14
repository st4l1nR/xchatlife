"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeft, PanelLeftClose, Handshake } from "lucide-react";
import Logo from "../atoms/logo";
import DialogRequestAffiliation from "./DialogRequestAffiliation";
import DialogAuth, { type DialogAuthVariant } from "./DialogAuth";
import { useApp } from "@/app/_contexts/AppContext";
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
  const [isAffiliateDialogOpen, setIsAffiliateDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authDialogVariant, setAuthDialogVariant] =
    useState<DialogAuthVariant>("sign-in");
  const [pendingAffiliateFlow, setPendingAffiliateFlow] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useApp();

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleAffiliateClick = () => {
    if (isAuthenticated) {
      // User is logged in, open affiliate dialog directly
      setIsAffiliateDialogOpen(true);
    } else {
      // User is not logged in, start auth flow
      setPendingAffiliateFlow(true);
      setIsAuthDialogOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    // After successful auth, check if we have pending affiliate flow
    if (pendingAffiliateFlow) {
      setPendingAffiliateFlow(false);
      // Small delay to let auth dialog close smoothly
      setTimeout(() => {
        setIsAffiliateDialogOpen(true);
      }, 100);
    }
  };

  const handleAuthClose = () => {
    setIsAuthDialogOpen(false);
    // If user closes auth dialog without completing, reset pending flow
    setPendingAffiliateFlow(false);
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
            {/* Affiliate Item */}
            <SidebarItem onClick={handleAffiliateClick}>
              <Handshake className="h-5 w-5" />
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SidebarLabel>Affiliate</SidebarLabel>
                  </motion.span>
                )}
              </AnimatePresence>
            </SidebarItem>

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

      {/* Affiliate Dialog */}
      <DialogRequestAffiliation
        open={isAffiliateDialogOpen}
        onClose={() => setIsAffiliateDialogOpen(false)}
      />

      {/* Auth Dialog for non-logged-in users */}
      <DialogAuth
        open={isAuthDialogOpen}
        onClose={handleAuthClose}
        variant={authDialogVariant}
        onVariantChange={setAuthDialogVariant}
        onAuthSuccess={handleAuthSuccess}
      />
    </motion.div>
  );
};

export default SidebarHome;
