"use client";

import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import { LogOut, Venus, Sparkles, Mars } from "lucide-react";
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
import DialogAuth, { type DialogAuthVariant } from "./DialogAuth";
import DropdownToken from "../molecules/DropdownToken";
import { Logo } from "../atoms/logo";
import { authClient } from "@/server/better-auth/client";
import { useApp } from "@/app/_contexts/AppContext";

// Default pricing items for DropdownToken
const DEFAULT_PRICING = [
  { label: "Message", cost: 1, color: "green" as const },
  { label: "Voice message", cost: 2, color: "blue" as const },
  { label: "Photo", cost: 5, color: "purple" as const },
  { label: "Video", cost: 10, color: "orange" as const },
];

const CATEGORY_TABS = [
  { label: "Girls", href: "/realistic-girl", icon: Venus },
  { label: "Anime", href: "/anime-girl", icon: Sparkles },
  { label: "Guys", href: "/realistic-men", icon: Mars },
] as const;

export type NavbarHomeProps = {
  className?: string;
  showOnlineStatus?: boolean;
};

/**
 * NavbarHome - Top navigation bar component
 *
 * A responsive navbar component featuring:
 * - When logged in: User avatar with dropdown menu and logout option
 * - When logged out: "Join Free" (primary) and "Login" (outline) buttons
 *
 * Uses semantic colors that automatically adapt to light/dark themes.
 */
export const NavbarHome = forwardRef<
  HTMLElement,
  NavbarHomeProps & Omit<ComponentPropsWithoutRef<"nav">, "children">
>(function NavbarHome({ className, showOnlineStatus = true, ...props }, ref) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { data: session, isPending } = authClient.useSession();
  const { hasActiveSubscription, tokensAvailable } = useApp();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");

  const user = session?.user;
  const userName = user?.name || "User";
  const userEmail = user?.email;
  const avatarSrc = user?.image;
  const avatarInitials = userName.substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin");
        },
      },
    });
  };

  const openSignIn = () => {
    setAuthVariant("sign-in");
    setAuthDialogOpen(true);
  };

  const openSignUp = () => {
    setAuthVariant("sign-up");
    setAuthDialogOpen(true);
  };

  // Category tabs component
  const CategoryTabs = (
    <div className="flex items-center gap-1 sm:gap-2">
      {CATEGORY_TABS.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3 sm:py-2",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );

  // Tokens dropdown component
  const TokensDropdownElement = (
    <DropdownToken
      tokenCount={tokensAvailable}
      pricing={DEFAULT_PRICING}
      onBuyMore={() => {
        router.push("/buy-tokens");
      }}
      onAddTokens={() => {
        router.push("/buy-tokens");
      }}
    />
  );

  // Auth section (login/join buttons or user dropdown)
  const AuthSection =
    !isPending && !session ? (
      <>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button outline onClick={openSignIn}>
            Login
          </Button>
          <Button color="primary" onClick={openSignUp}>
            Join Free
          </Button>
        </div>
        <DialogAuth
          open={authDialogOpen}
          onClose={() => setAuthDialogOpen(false)}
          variant={authVariant}
          onVariantChange={setAuthVariant}
        />
      </>
    ) : (
      <div className="ml-2 sm:ml-4">
        <Dropdown>
          <DropdownButton
            as="button"
            className="focus:ring-ring relative flex items-center rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            <span className="sr-only">Open user menu</span>
            <div className="relative">
              <Avatar
                src={avatarSrc}
                initials={avatarInitials}
                alt={userName}
                className="size-9"
              />
              {showOnlineStatus && (
                <span className="ring-card absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2" />
              )}
            </div>
          </DropdownButton>

          <DropdownMenu anchor="bottom end" className="min-w-50">
            {(userName || userEmail) && (
              <>
                <div className="px-3.5 py-2.5 sm:px-3">
                  {userName && (
                    <p className="text-foreground text-sm font-medium">
                      {userName}
                    </p>
                  )}
                  {userEmail && (
                    <p className="text-muted-foreground truncate text-xs">
                      {userEmail}
                    </p>
                  )}
                </div>
                <DropdownDivider />
              </>
            )}

            <DropdownItem onClick={handleLogout}>
              <div className="flex items-center gap-2">
                <LogOut className="size-4" data-slot="icon" />
                <DropdownLabel>Log out</DropdownLabel>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );

  // Only show tokens dropdown for users with active subscription
  const showTokens = !isPending && session && hasActiveSubscription;

  return (
    <nav
      ref={ref}
      className={clsx(
        "border-border bg-sidebar flex flex-col border-b",
        className,
      )}
      {...props}
    >
      {/* Main navbar row */}
      <div className="flex items-center px-4 py-3.5 sm:px-6">
        {/* Mobile: Logo on the left */}
        {isMobile && <Logo href="/" size="sm" withText={false} />}

        {/* Desktop: Tabs first */}
        {!isMobile && CategoryTabs}

        <div className="flex-1" />

        {/* Desktop: Tokens (if logged in) */}
        {!isMobile && showTokens && (
          <div className="mr-3">{TokensDropdownElement}</div>
        )}

        {AuthSection}
      </div>

      {/* Mobile: Category tabs in second row */}
      {isMobile && (
        <div className="border-border flex items-center justify-center gap-4 border-t px-4 py-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={clsx(
                  "flex items-center gap-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
});

export default NavbarHome;
