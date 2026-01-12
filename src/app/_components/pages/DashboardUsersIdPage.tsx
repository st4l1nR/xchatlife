"use client";

import React, { Suspense, useMemo } from "react";
import clsx from "clsx";
import { LayoutList } from "lucide-react";
import HeaderUserCharacter from "../organisms/HeaderUserCharacter";
import AsideUserSummary from "../organisms/AsideUserSummary";
import ListSnackActivity from "../organisms/ListSnackActivity";
import type {
  SnackActivityProps,
  ActivityCategory,
} from "../molecules/SnackActivity";
import { api } from "@/trpc/react";

export type DashboardUsersIdPageMockData = {
  // Header props
  name: string;
  avatarSrc?: string | null;
  role?: string;
  location?: string;
  joinedDate?: string;
  bannerSrc?: string;
  // Aside props
  fullName?: string;
  status?: "Active" | "Inactive" | "Suspended";
  country?: string;
  language?: string;
  phone?: string;
  email?: string;
  messagesSent?: number | string;
  charactersCreated?: number | string;
  visualNovels?: number | string;
  collectionItems?: number | string;
  tokensUsed?: number | string;
  memberSince?: string | number;
  // Activities
  activities?: SnackActivityProps[];
};

export type DashboardUsersIdPageProps = {
  className?: string;
  userId?: string;
  mock?: DashboardUsersIdPageMockData;
};

// Map transaction type to activity category
function getActivityCategory(type: string): ActivityCategory {
  const typeMap: Record<string, ActivityCategory> = {
    purchase: "subscription",
    usage: "chat",
    refund: "subscription",
    bonus: "milestone",
    referral: "affiliate",
    subscription: "subscription",
    message: "chat",
    character_creation: "content",
    image_generation: "media",
  };
  return typeMap[type.toLowerCase()] ?? "account";
}

// Format date for display
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Format relative time for activity
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
}

// Map subscription status to display status
function getDisplayStatus(
  subscriptionStatus?: string | null,
): "Active" | "Inactive" | "Suspended" {
  if (!subscriptionStatus) return "Inactive";

  const statusMap: Record<string, "Active" | "Inactive" | "Suspended"> = {
    active: "Active",
    trialing: "Active",
    past_due: "Suspended",
    canceled: "Inactive",
    cancelled: "Inactive",
    unpaid: "Suspended",
    incomplete: "Inactive",
    incomplete_expired: "Inactive",
  };

  return statusMap[subscriptionStatus.toLowerCase()] ?? "Inactive";
}

// Capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function DashboardUsersIdPageContent({
  className,
  userId,
  mock,
}: DashboardUsersIdPageProps) {
  // Fetch user data (disabled when using mock data)
  const { data, isLoading } = api.admin.getUserById.useQuery(
    { id: userId! },
    { enabled: !mock && !!userId },
  );

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      return {
        name: mock.name,
        avatarSrc: mock.avatarSrc,
        role: mock.role,
        location: mock.location,
        joinedDate: mock.joinedDate,
        bannerSrc: mock.bannerSrc,
        fullName: mock.fullName,
        status: mock.status,
        country: mock.country,
        language: mock.language,
        phone: mock.phone,
        email: mock.email,
        messagesSent: mock.messagesSent,
        charactersCreated: mock.charactersCreated,
        visualNovels: mock.visualNovels,
        collectionItems: mock.collectionItems,
        tokensUsed: mock.tokensUsed,
        memberSince: mock.memberSince,
        activities: mock.activities ?? [],
        activitiesLoading: false,
      };
    }

    if (!data?.data) {
      return {
        name: "",
        avatarSrc: null,
        role: undefined,
        location: undefined,
        joinedDate: undefined,
        bannerSrc: undefined,
        fullName: undefined,
        status: undefined as "Active" | "Inactive" | "Suspended" | undefined,
        country: undefined,
        language: undefined,
        phone: undefined,
        email: undefined,
        messagesSent: undefined,
        charactersCreated: undefined,
        visualNovels: undefined,
        collectionItems: undefined,
        tokensUsed: undefined,
        memberSince: undefined,
        activities: [] as SnackActivityProps[],
        activitiesLoading: isLoading,
      };
    }

    const { user, activities } = data.data;

    // Transform activities from token transactions
    const transformedActivities: SnackActivityProps[] = activities.map(
      (activity) => ({
        id: activity.id,
        category: getActivityCategory(activity.transactionType),
        title: activity.description ?? `${capitalize(activity.transactionType)} transaction`,
        description:
          activity.amount !== 0
            ? `${activity.amount > 0 ? "+" : ""}${activity.amount} tokens`
            : undefined,
        timestamp: formatRelativeTime(new Date(activity.createdAt)),
      }),
    );

    return {
      name: user.name,
      avatarSrc: user.image,
      role: user.customRole?.name ?? capitalize(user.role),
      location: undefined, // Not available in user model
      joinedDate: formatDate(new Date(user.createdAt)),
      bannerSrc: undefined, // Not available in user model
      fullName: user.name,
      status: getDisplayStatus(user.subscription?.status),
      country: undefined, // Not available in user model
      language: capitalize(user.language),
      phone: undefined, // Not available in user model
      email: user.email,
      messagesSent: user._count.chat,
      charactersCreated: user._count.character,
      visualNovels: user._count.visual_novel,
      collectionItems: user._count.collection,
      tokensUsed: user.tokenBalance,
      memberSince: formatDate(new Date(user.createdAt)),
      activities: transformedActivities,
      activitiesLoading: false,
    };
  }, [mock, data, isLoading]);

  // Loading state
  if (isLoading && !mock) {
    return (
      <div className={clsx("space-y-6", className)}>
        {/* Header skeleton */}
        <div className="bg-muted h-48 animate-pulse rounded-lg" />

        {/* Two-column layout skeleton */}
        <div className="flex gap-6">
          <div className="bg-muted h-96 w-[320px] shrink-0 animate-pulse rounded-lg" />
          <div className="bg-muted h-96 flex-1 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("space-y-6", className)}>
      {/* Header */}
      <HeaderUserCharacter
        name={processedData.name}
        avatarSrc={processedData.avatarSrc}
        role={processedData.role}
        location={processedData.location}
        joinedDate={processedData.joinedDate}
        bannerSrc={processedData.bannerSrc}
      />

      {/* Two-column layout - 1/3 aside, 2/3 activity */}
      <div className="flex gap-6">
        {/* Left sidebar - fixed width */}
        <div className="w-[320px] shrink-0">
          <AsideUserSummary
            fullName={processedData.fullName}
            status={processedData.status}
            role={processedData.role}
            country={processedData.country}
            language={processedData.language}
            phone={processedData.phone}
            email={processedData.email}
            messagesSent={processedData.messagesSent}
            charactersCreated={processedData.charactersCreated}
            visualNovels={processedData.visualNovels}
            collectionItems={processedData.collectionItems}
            tokensUsed={processedData.tokensUsed}
            memberSince={processedData.memberSince}
          />
        </div>

        {/* Right content - Activity Timeline card */}
        <div className="bg-muted flex-1 rounded-lg p-6">
          {/* Card header */}
          <div className="mb-6 flex items-center gap-2">
            <LayoutList className="text-muted-foreground size-5" />
            <h2 className="text-foreground text-lg font-semibold">
              Activity Timeline
            </h2>
          </div>

          {/* Activity list */}
          <ListSnackActivity
            loading={processedData.activitiesLoading}
            activities={processedData.activities}
            emptyStateTitle="No activity yet"
            emptyStateDescription="User activity will appear here once they start using the platform."
          />
        </div>
      </div>
    </div>
  );
}

const DashboardUsersIdPage: React.FC<DashboardUsersIdPageProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="bg-muted h-48 animate-pulse rounded-lg" />
          <div className="flex gap-6">
            <div className="bg-muted h-96 w-[320px] shrink-0 animate-pulse rounded-lg" />
            <div className="bg-muted h-96 flex-1 animate-pulse rounded-lg" />
          </div>
        </div>
      }
    >
      <DashboardUsersIdPageContent {...props} />
    </Suspense>
  );
};

export default DashboardUsersIdPage;
