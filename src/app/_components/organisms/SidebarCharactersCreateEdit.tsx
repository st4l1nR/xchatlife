"use client";

import React from "react";
import * as Headless from "@headlessui/react";
import clsx from "clsx";
import { CircleUser, Film, ScrollText, Lock } from "lucide-react";

export type TabKey = "profile" | "reels" | "stories" | "private-content";

const TABS = [
  { key: "profile" as const, label: "Profile", icon: CircleUser },
  { key: "reels" as const, label: "Reels", icon: Film },
  { key: "stories" as const, label: "Stories", icon: ScrollText },
  { key: "private-content" as const, label: "Private Content", icon: Lock },
];

export type SidebarCharactersCreateEditProps = {
  className?: string;
};

const SidebarCharactersCreateEdit: React.FC<SidebarCharactersCreateEditProps> = ({
  className,
}) => {
  return (
    <div className={clsx("flex flex-col", className)}>
      <h3 className="text-muted-foreground mb-2 px-3 text-xs font-medium">
        Getting Started
      </h3>
      <Headless.TabList className="flex flex-col gap-0.5">
        {TABS.map((tab) => (
          <Headless.Tab
            key={tab.key}
            className={({ selected }) =>
              clsx(
                "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium outline-none transition-colors",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )
            }
          >
            {({ selected }) => (
              <>
                <tab.icon
                  className={clsx(
                    "h-5 w-5 shrink-0",
                    selected ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                />
                <span>{tab.label}</span>
              </>
            )}
          </Headless.Tab>
        ))}
      </Headless.TabList>
    </div>
  );
};

export default SidebarCharactersCreateEdit;

// Helper to get tab key from index
export const getTabKeyFromIndex = (index: number): TabKey => {
  return TABS[index]?.key ?? "profile";
};

// Helper to get index from tab key
export const getIndexFromTabKey = (key: TabKey): number => {
  const index = TABS.findIndex((tab) => tab.key === key);
  return index >= 0 ? index : 0;
};
