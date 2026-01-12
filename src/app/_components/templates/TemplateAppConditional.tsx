"use client";

import { usePathname } from "next/navigation";
import TemplateApp from "./TemplateApp";

export type TemplateAppConditionalProps = {
  children: React.ReactNode;
};

/**
 * TemplateAppConditional - Conditionally applies TemplateApp layout
 *
 * Wraps children with TemplateApp layout only for non-dashboard routes.
 * Dashboard routes have their own TemplateDashboard layout applied
 * in the dashboard layout.tsx file.
 */
export const TemplateAppConditional = ({
  children,
}: TemplateAppConditionalProps) => {
  const pathname = usePathname();

  // Don't apply TemplateApp for dashboard routes - they have their own layout
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  if (isDashboardRoute) {
    return <>{children}</>;
  }

  return <TemplateApp>{children}</TemplateApp>;
};

export default TemplateAppConditional;
