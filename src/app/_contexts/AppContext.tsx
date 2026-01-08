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

  // Token/Usage state
  tokensAvailable: number;
  tokensUsed: number;
  tokensLimit: number;
  isUsageLoading: boolean;

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
  });

  // Usage quota query (only when authenticated)
  const {
    data: usageData,
    isLoading: isUsageLoading,
    refetch: refetchUsage,
  } = api.user.getUsageQuota.useQuery(undefined, {
    enabled: !!session?.user,
  });

  // Refetch all session-related data
  const refetchSession = useCallback(async () => {
    await refetchAuth();
    // These will auto-refetch when session changes due to enabled condition
    await Promise.all([refetchSubscription(), refetchUsage()]);
  }, [refetchAuth, refetchSubscription, refetchUsage]);

  const value = useMemo<AppContextValue>(() => {
    const user = session?.user ?? null;
    const subscription = subscriptionData?.data ?? null;
    const usage = usageData?.data ?? null;

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
      tokensAvailable: usage ? usage.tokensLimit - usage.tokensUsed : 0,
      tokensUsed: usage?.tokensUsed ?? 0,
      tokensLimit: usage?.tokensLimit ?? 0,
      isUsageLoading: !!session?.user && isUsageLoading,

      // Combined
      isLoading:
        isAuthLoading ||
        (!!session?.user && (isSubscriptionLoading || isUsageLoading)),

      // Actions
      refetchSession,
    };
  }, [
    session,
    isAuthLoading,
    subscriptionData,
    isSubscriptionLoading,
    usageData,
    isUsageLoading,
    refetchSession,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
