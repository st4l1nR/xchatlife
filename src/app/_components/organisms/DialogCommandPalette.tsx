"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import { Search } from "lucide-react";
import clsx from "clsx";
import {
  dashboardNavigation,
  dashboardToolsNavigation,
  type DashboardNavItem,
  type DashboardNavChild,
} from "@/lib/dashboard-navigation";

type CommandPaletteItem = {
  id: string;
  name: string;
  href: string;
  section: string;
  icon?: DashboardNavItem["icon"];
};

export type DialogCommandPaletteProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
};

/**
 * Flattens the navigation structure into a searchable list of items.
 */
function flattenNavigation(): CommandPaletteItem[] {
  const items: CommandPaletteItem[] = [];

  // Add main dashboard navigation
  dashboardNavigation.forEach((item) => {
    if (item.href) {
      items.push({
        id: item.href,
        name: item.name,
        href: item.href,
        section: "Navigation",
        icon: item.icon,
      });
    }

    if (item.children) {
      item.children.forEach((child: DashboardNavChild) => {
        items.push({
          id: child.href,
          name: `${item.name} - ${child.name}`,
          href: child.href,
          section: "Navigation",
          icon: item.icon,
        });
      });
    }
  });

  // Add tools navigation
  dashboardToolsNavigation.forEach((item) => {
    // Skip inactive items
    if (item.inactive) return;

    if (item.href) {
      items.push({
        id: item.href,
        name: item.name,
        href: item.href,
        section: "Tools",
        icon: item.icon,
      });
    }

    if (item.children) {
      item.children.forEach((child: DashboardNavChild) => {
        items.push({
          id: child.href,
          name: `${item.name} - ${child.name}`,
          href: child.href,
          section: "Tools",
          icon: item.icon,
        });
      });
    }
  });

  return items;
}

/**
 * DialogCommandPalette - A command palette for quick navigation
 *
 * Features:
 * - Opens with ⌘K (Mac) or Ctrl+K (Windows)
 * - Searches through all dashboard navigation items
 * - Quick keyboard navigation with arrow keys
 * - Press Enter to navigate to selected item
 *
 * Uses semantic colors that automatically adapt to light/dark themes.
 */
const DialogCommandPalette: React.FC<DialogCommandPaletteProps> = ({
  className,
  open,
  onClose,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const navigationItems = useMemo(() => flattenNavigation(), []);

  const filteredItems = useMemo(() => {
    if (query === "") {
      // When no query, show all items grouped by section
      return navigationItems;
    }

    return navigationItems.filter((item) => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, navigationItems]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const handleSelect = (item: CommandPaletteItem | null) => {
    if (item) {
      router.push(item.href);
      onClose();
    }
  };

  // Group items by section for display
  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandPaletteItem[]> = {};
    filteredItems.forEach((item) => {
      const section = groups[item.section] ?? [];
      section.push(item);
      groups[item.section] = section;
    });
    return groups;
  }, [filteredItems]);

  return (
    <Dialog
      className={clsx("relative z-50", className)}
      open={open}
      onClose={() => {
        onClose();
        setQuery("");
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel
          transition
          className="bg-popover border-border divide-border mx-auto max-w-xl transform divide-y overflow-hidden rounded-xl border shadow-2xl ring-1 ring-black/5 transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        >
          <Combobox<CommandPaletteItem | null> onChange={handleSelect}>
            <div className="relative">
              <Search
                className="text-muted-foreground pointer-events-none absolute top-3.5 left-4 size-5"
                aria-hidden="true"
              />
              <ComboboxInput
                autoFocus
                className="text-foreground placeholder:text-muted-foreground bg-popover h-12 w-full border-0 pr-4 pl-11 text-sm outline-none focus:ring-0"
                placeholder="Search navigation..."
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            {filteredItems.length > 0 && (
              <ComboboxOptions
                static
                className="scrollbar-muted max-h-80 scroll-py-2 overflow-y-auto py-2"
              >
                {Object.entries(groupedItems).map(([section, items]) => (
                  <div key={section}>
                    <div className="text-muted-foreground px-4 py-2 text-xs font-semibold tracking-wider uppercase">
                      {section}
                    </div>
                    {items.map((item) => (
                      <ComboboxOption
                        key={item.id}
                        value={item}
                        className="text-foreground data-focus:bg-accent data-focus:text-accent-foreground cursor-pointer px-4 py-2 text-sm select-none"
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <item.icon className="text-muted-foreground size-4" />
                          )}
                          <span>{item.name}</span>
                        </div>
                      </ComboboxOption>
                    ))}
                  </div>
                ))}
              </ComboboxOptions>
            )}

            {query !== "" && filteredItems.length === 0 && (
              <p className="text-muted-foreground p-4 text-sm">
                No results found for &quot;{query}&quot;.
              </p>
            )}

            {query === "" && filteredItems.length === 0 && (
              <p className="text-muted-foreground p-4 text-sm">
                No navigation items available.
              </p>
            )}
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DialogCommandPalette;
