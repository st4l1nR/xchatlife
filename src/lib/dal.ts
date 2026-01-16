import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";

export type SessionResult = {
  isAuth: true;
  userId: string;
};

export type AdminSessionResult = SessionResult & {
  role: "ADMIN" | "SUPERADMIN";
};

/**
 * Verifies that the user has an active session.
 * Redirects to signin if not authenticated.
 * Cached to prevent redundant checks during a React render pass.
 */
export const verifySession = cache(async (): Promise<SessionResult> => {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return { isAuth: true, userId: session.user.id };
});

/**
 * Verifies that the user is an admin (ADMIN or SUPERADMIN role).
 * Redirects to signin if not authenticated.
 * Redirects to dashboard if authenticated but not admin.
 * Cached to prevent redundant checks during a React render pass.
 */
export const verifyAdmin = cache(async (): Promise<AdminSessionResult> => {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { customRole: { select: { name: true } } },
  });

  const roleName = user?.customRole?.name?.toUpperCase();
  const isAdmin = roleName === "ADMIN";
  const isSuperAdmin = roleName === "SUPERADMIN";

  if (!isAdmin && !isSuperAdmin) {
    redirect("/dashboard");
  }

  return {
    isAuth: true,
    userId: session.user.id,
    role: isAdmin ? ("ADMIN" as const) : ("SUPERADMIN" as const),
  };
});
