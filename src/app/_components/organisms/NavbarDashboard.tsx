"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Search, Moon, Sun, Settings, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar } from "../atoms/avatar";
import { Button } from "../atoms/button";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownDivider,
} from "../atoms/dropdown";
import { authClient } from "@/server/better-auth/client";
import { useApp } from "@/app/_contexts/AppContext";

export type NavbarDashboardProps = {
  className?: string;
  avatarSrc?: string;
  userName?: string;
  userEmail?: string;
};

/**
 * NavbarDashboard - Top navigation bar for dashboard pages
 *
 * Features:
 * - Search input with ⌘K shortcut hint
 * - Theme toggle (light/dark)
 * - User avatar with dropdown menu (Settings, Logout)
 *
 * Uses semantic colors that automatically adapt to light/dark themes.
 */
export const NavbarDashboard = forwardRef<
  HTMLElement,
  NavbarDashboardProps & Omit<ComponentPropsWithoutRef<"nav">, "children">
>(function NavbarDashboard(
  { className, avatarSrc, userName, userEmail, ...props },
  ref,
) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session } = authClient.useSession();
  const { user } = useApp();

  // Use props if provided, otherwise fall back to session/context data
  const displayName = userName ?? session?.user?.name ?? user?.name ?? "User";
  const displayEmail = userEmail ?? session?.user?.email ?? user?.email;
  const displayAvatar = avatarSrc ?? session?.user?.image ?? user?.image;
  const avatarInitials = displayName.substring(0, 2).toUpperCase();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin");
        },
      },
    });
  };

  return (
    <nav
      ref={ref}
      className={clsx(
        "border-border bg-sidebar flex items-center border-b px-4 py-3 sm:px-6",
        className,
      )}
      {...props}
    >
      {/* Search Section */}
      <div className="relative flex items-center">
        <Search className="text-muted-foreground pointer-events-none absolute left-3 size-4" />
        <input
          type="search"
          placeholder="Search ⌘K"
          aria-label="Search"
          className={clsx(
            "border-border bg-background h-9 w-64 rounded-lg border pr-3 pl-9",
            "text-foreground placeholder:text-muted-foreground text-sm",
            "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
            "transition-colors",
          )}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          plain
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="size-5" data-slot="icon" />
          ) : (
            <Moon className="size-5" data-slot="icon" />
          )}
        </Button>

        {/* Avatar Dropdown */}
        <Dropdown>
          <DropdownButton
            as="button"
            className="focus:ring-ring relative flex items-center rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            <span className="sr-only">Open user menu</span>
            <Avatar
              src={displayAvatar}
              initials={avatarInitials}
              alt={displayName}
              className="size-9"
            />
          </DropdownButton>

          <DropdownMenu anchor="bottom end" className="min-w-48">
            {(displayName || displayEmail) && (
              <>
                <div className="px-3.5 py-2.5 sm:px-3">
                  {displayName && (
                    <p className="text-foreground text-sm font-medium">
                      {displayName}
                    </p>
                  )}
                  {displayEmail && (
                    <p className="text-muted-foreground truncate text-xs">
                      {displayEmail}
                    </p>
                  )}
                </div>
                <DropdownDivider />
              </>
            )}

            <DropdownItem href="/dashboard/settings">
              <Settings className="size-4" data-slot="icon" />
              <DropdownLabel>Settings</DropdownLabel>
            </DropdownItem>

            <DropdownDivider />

            <DropdownItem onClick={handleLogout}>
              <LogOut className="size-4" data-slot="icon" />
              <DropdownLabel>Logout</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  );
});

export default NavbarDashboard;
