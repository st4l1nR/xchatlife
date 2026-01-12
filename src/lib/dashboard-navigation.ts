import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Users2,
  BookImage,
  ArrowLeftRight,
  Handshake,
  LifeBuoy,
} from "lucide-react";

export type DashboardNavChild = {
  name: string;
  href: string;
};

export type DashboardNavItem = {
  name: string;
  href?: string;
  icon: LucideIcon;
  children?: DashboardNavChild[];
};

/**
 * Dashboard navigation items with collapsible sections
 * Used by SidebarDashboard component
 */
export const dashboardNavigation: DashboardNavItem[] = [
  {
    name: "Dashboards",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

/**
 * Dashboard tools navigation - collapsible sections
 */
export const dashboardToolsNavigation: DashboardNavItem[] = [
  {
    name: "Roles",
    icon: ShieldCheck,
    children: [
      { name: "View All", href: "/dashboard/roles" },
      { name: "Create", href: "/dashboard/roles/create" },
    ],
  },
  {
    name: "Users",
    icon: Users,
    children: [
      { name: "View All", href: "/dashboard/users" },
      { name: "Create", href: "/dashboard/users/create" },
    ],
  },
  {
    name: "Characters",
    icon: Users2,
    children: [
      { name: "View All", href: "/dashboard/characters" },
      { name: "Create", href: "/dashboard/characters/create" },
      { name: "Kinks", href: "/dashboard/characters/kinks" },
      { name: "Ethnicities", href: "/dashboard/characters/ethnicities" },
      { name: "Personalities", href: "/dashboard/characters/personalities" },
      { name: "Hair Styles", href: "/dashboard/characters/hair-styles" },
      { name: "Hair Colors", href: "/dashboard/characters/hair-colors" },
      { name: "Eye Colors", href: "/dashboard/characters/eye-colors" },
      { name: "Body Types", href: "/dashboard/characters/body-types" },
      { name: "Breast Sizes", href: "/dashboard/characters/breast-sizes" },
      { name: "Occupations", href: "/dashboard/characters/occupations" },
      { name: "Relationships", href: "/dashboard/characters/relationships" },
    ],
  },
  {
    name: "Visual Novels",
    icon: BookImage,
    children: [
      { name: "View/Create", href: "/dashboard/visual-novels" },
      { name: "Media", href: "/dashboard/visual-novels/media" },
    ],
  },
  {
    name: "Transactions",
    icon: ArrowLeftRight,
    children: [
      { name: "View All", href: "/dashboard/transactions" },
      { name: "Create", href: "/dashboard/transactions/create" },
    ],
  },
  {
    name: "Affiliates",
    icon: Handshake,
    children: [
      { name: "View All", href: "/dashboard/affiliates" },
      { name: "Referrals", href: "/dashboard/affiliates/referrals" },
      { name: "Payouts", href: "/dashboard/affiliates/payouts" },
    ],
  },
  {
    name: "Support tickets",
    icon: LifeBuoy,
    children: [
      { name: "View all", href: "/dashboard/support-tickets" },
      { name: "Open", href: "/dashboard/support-tickets/open" },
      { name: "Resolved", href: "/dashboard/support-tickets/resolved" },
    ],
  },
];
