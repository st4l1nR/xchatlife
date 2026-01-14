"use client";

import React, { createContext, useContext, useMemo, useCallback } from "react";
import { authClient } from "@/server/better-auth/client";
import { api } from "@/trpc/react";

type AppContextValue = {
  // Auth state
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;

  // Subscription state
  hasActiveSubscription: boolean;
  subscription: {
    status: string;
    billingCycle: string;
    currentPeriodEnd: Date;
  } | null;
  isSubscriptionLoading: boolean;

  // Token state (simplified - just a balance)
  tokensAvailable: number;
  isTokenLoading: boolean;

  // Combined loading state
  isLoading: boolean;

  // Actions
  refetchSession: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppContextProvider");
  }
  return context;
}

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth session from better-auth
  const {
    data: session,
    isPending: isAuthLoading,
    refetch: refetchAuth,
  } = authClient.useSession();

  // Subscription query (only when authenticated)
  const {
    data: subscriptionData,
    isLoading: isSubscriptionLoading,
    refetch: refetchSubscription,
  } = api.user.getSubscription.useQuery(undefined, {
    enabled: !!session?.user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Token balance query (only when authenticated)
  const {
    data: tokenData,
    isLoading: isTokenLoading,
    refetch: refetchTokens,
  } = api.user.getTokenBalance.useQuery(undefined, {
    enabled: !!session?.user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Refetch all session-related data
  const refetchSession = useCallback(async () => {
    await refetchAuth();
    // These will auto-refetch when session changes due to enabled condition
    await Promise.all([refetchSubscription(), refetchTokens()]);
  }, [refetchAuth, refetchSubscription, refetchTokens]);

  const value = useMemo<AppContextValue>(() => {
    const user = session?.user ?? null;
    const subscription = subscriptionData?.data ?? null;
    const tokenBalance = tokenData?.data?.tokenBalance ?? 0;

    return {
      // Auth
      isAuthenticated: !!user,
      isAuthLoading,
      user: user
        ? {
            id: user.id,
            name: user.name ?? "",
            email: user.email,
            image: user.image ?? null,
          }
        : null,

      // Subscription
      hasActiveSubscription: subscription?.status === "active",
      subscription: subscription
        ? {
            status: subscription.status,
            billingCycle: subscription.billingCycle,
            currentPeriodEnd: new Date(subscription.currentPeriodEnd),
          }
        : null,
      isSubscriptionLoading: !!session?.user && isSubscriptionLoading,

      // Tokens
      tokensAvailable: tokenBalance,
      isTokenLoading: !!session?.user && isTokenLoading,

      // Combined
      isLoading:
        isAuthLoading ||
        (!!session?.user && (isSubscriptionLoading || isTokenLoading)),

      // Actions
      refetchSession,
    };
  }, [
    session,
    isAuthLoading,
    subscriptionData,
    isSubscriptionLoading,
    tokenData,
    isTokenLoading,
    refetchSession,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
