"use client";

import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import SidebarHome from "../organisms/SidebarHome";
import NavbarHome from "../organisms/NavbarHome";
import NavbarMobileHome from "../organisms/NavbarMobileHome";

export type TemplateDashboardProps = {
  /**
   * Main content to display in the dashboard area
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes for the main container
   */
  className?: string;
};

/**
 * TemplateDashboard - Main dashboard layout template
 *
 * A comprehensive dashboard layout combining:
 * - Collapsible sidebar navigation (SidebarHome) - Desktop only
 * - Mobile bottom navigation (NavbarMobileHome) - Mobile only
 * - Top navigation bar with user menu (NavbarHome) - Desktop only
 * - Main content area for page content
 *
 * Fully self-contained - automatically fetches user information from better-auth session
 * and detects the current path for navigation highlighting.
 * Responsive design: switches between desktop and mobile layouts at md breakpoint (768px).
 * Uses semantic colors that automatically adapt to light/dark themes.
 */
export const TemplateDashboard = ({
  children,
  className,
}: TemplateDashboardProps) => {
  // Detect mobile viewport (below md breakpoint: 768px)
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className={clsx("bg-background flex h-screen", className)}>
      {/* Sidebar - Desktop only */}
      {!isMobile && <SidebarHome />}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <NavbarHome />

        {/* Page Content */}
        <main className="bg-background flex flex-1 flex-col overflow-auto">
          {children}
        </main>
        {/* Mobile Bottom Navigation - Mobile only, sticky inside main */}
        {isMobile && <NavbarMobileHome />}
      </div>
    </div>
  );
};

export default TemplateDashboard;
