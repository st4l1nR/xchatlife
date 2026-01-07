"use client";

import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { LogOut } from "lucide-react";
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
import { authClient } from "@/server/better-auth/client";

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
  const { data: session, isPending } = authClient.useSession();
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

  return (
    <nav
      ref={ref}
      className={clsx(
        "border-border bg-sidebar flex items-center justify-between border-b px-4 py-3.5 sm:px-6",
        className,
      )}
      {...props}
    >
      <div className="flex-1"></div>

      {!isPending && !session ? (
        <>
          <div className="flex items-center gap-3">
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
        <div className="ml-4">
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
      )}
    </nav>
  );
});

export default NavbarHome;
