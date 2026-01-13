"use client";

import React from "react";
import clsx from "clsx";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Users2,
  BookImage,
  ArrowLeftRight,
  Handshake,
  LifeBuoy,
} from "lucide-react";

const DASHBOARD_CARDS = [
  {
    title: "Users",
    description: "Manage user accounts and invitations",
    href: "/dashboard/users",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Roles",
    description: "Configure roles and permissions",
    href: "/dashboard/roles",
    icon: ShieldCheck,
    color: "text-purple-500",
  },
  {
    title: "Characters",
    description: "Manage AI characters and attributes",
    href: "/dashboard/characters",
    icon: Users2,
    color: "text-pink-500",
  },
  {
    title: "Visual Novels",
    description: "Create and manage visual novel content",
    href: "/dashboard/visual-novels",
    icon: BookImage,
    color: "text-amber-500",
  },
  {
    title: "Transactions",
    description: "View and manage transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
    color: "text-green-500",
  },
  {
    title: "Affiliates",
    description: "Manage affiliate programs and payouts",
    href: "/dashboard/affiliates",
    icon: Handshake,
    color: "text-teal-500",
  },
  {
    title: "Support Tickets",
    description: "Handle customer support requests",
    href: "/dashboard/support-tickets",
    icon: LifeBuoy,
    color: "text-red-500",
  },
] as const;

export type DashboardPageProps = {
  className?: string;
};

const DashboardPage: React.FC<DashboardPageProps> = ({ className }) => {
  return (
    <div className={clsx("space-y-8", className)}>
      {/* Header */}
      <div>
        <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the admin dashboard. Manage your platform from here.
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DASHBOARD_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-muted hover:bg-muted/80 group rounded-lg p-6 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className={clsx("bg-background rounded-lg p-3", card.color)}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground font-semibold group-hover:underline">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
