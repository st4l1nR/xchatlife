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
  isEditMode?: boolean;
};

const SidebarCharactersCreateEdit: React.FC<
  SidebarCharactersCreateEditProps
> = ({ className, isEditMode = false }) => {
  return (
    <div className={clsx("flex flex-col", className)}>
      <h3 className="text-muted-foreground mb-2 px-3 text-xs font-medium">
        Getting Started
      </h3>
      <Headless.TabList className="flex flex-col gap-0.5">
        {TABS.map((tab) => {
          // Disable reels, stories, and private-content tabs in create mode
          const isDisabled = !isEditMode && tab.key !== "profile";

          return (
            <Headless.Tab
              key={tab.key}
              disabled={isDisabled}
              className={({ selected }) =>
                clsx(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors outline-none",
                  isDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted",
                  isDisabled && "hover:bg-transparent",
                )
              }
            >
              {({ selected }) => (
                <>
                  <tab.icon
                    className={clsx(
                      "h-5 w-5 shrink-0",
                      selected
                        ? "text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  />
                  <span>{tab.label}</span>
                </>
              )}
            </Headless.Tab>
          );
        })}
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
