"use client";

import React, { Suspense, useMemo, useState } from "react";
import clsx from "clsx";
import { FileText, Users } from "lucide-react";
import HeaderUserCharacter from "../organisms/HeaderUserCharacter";
import AsideAffiliateSummary from "../organisms/AsideAffiliateSummary";
import TableReferral from "../organisms/TableReferral";
import type {
  AffiliateStatusType,
  AffiliateTypeValue,
} from "../organisms/AsideAffiliateSummary";
import type { SortingState } from "@tanstack/react-table";
import { api } from "@/trpc/react";

export type DashboardAffiliatesIdPageMockData = {
  // Header props
  name: string;
  avatarSrc?: string | null;
  role?: string;
  joinedDate?: string;
  // Aside props
  email?: string;
  type?: AffiliateTypeValue;
  status?: AffiliateStatusType;
  websiteUrl?: string;
  telegram?: string;
  introduction?: string | null;
  promotionalMethods?: string | null;
  rejectionReason?: string | null;
  referralCode?: string | null;
  commissionRate?: number | null;
  totalEarned?: number;
  isActive?: boolean;
  appliedAt?: string;
  approvedAt?: string | null;
};

export type DashboardAffiliatesIdPageProps = {
  className?: string;
  affiliateId?: string;
  mock?: DashboardAffiliatesIdPageMockData;
};

// Format date for display
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Capitalize first letter of each word
function capitalizeWords(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function DashboardAffiliatesIdPageContent({
  className,
  affiliateId,
  mock,
}: DashboardAffiliatesIdPageProps) {
  // Referrals pagination state
  const [referralsPage, setReferralsPage] = useState(1);
  const [referralsSorting, setReferralsSorting] = useState<SortingState>([]);

  // Fetch affiliate data (disabled when using mock data)
  const { data, isLoading } = api.affiliate.getById.useQuery(
    { id: affiliateId! },
    { enabled: !mock && !!affiliateId },
  );

  // Fetch referrals for this affiliate
  const { data: referralsData, isLoading: isLoadingReferrals } =
    api.affiliate.getReferralsByAffiliateId.useQuery(
      {
        affiliateId: affiliateId!,
        page: referralsPage,
        limit: 10,
        sortBy:
          (referralsSorting[0]?.id as
            | "createdAt"
            | "convertedAt"
            | "commission") ?? "createdAt",
        sortOrder: referralsSorting[0]?.desc ? "desc" : "asc",
      },
      { enabled: !mock && !!affiliateId },
    );

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      return {
        name: mock.name,
        avatarSrc: mock.avatarSrc,
        role: mock.role,
        joinedDate: mock.joinedDate,
        email: mock.email,
        type: mock.type,
        status: mock.status,
        websiteUrl: mock.websiteUrl,
        telegram: mock.telegram,
        introduction: mock.introduction,
        promotionalMethods: mock.promotionalMethods,
        rejectionReason: mock.rejectionReason,
        referralCode: mock.referralCode,
        commissionRate: mock.commissionRate,
        totalEarned: mock.totalEarned,
        isActive: mock.isActive,
        appliedAt: mock.appliedAt,
        approvedAt: mock.approvedAt,
      };
    }

    if (!data?.data) {
      return {
        name: "",
        avatarSrc: null,
        role: undefined,
        joinedDate: undefined,
        // Aside props
        email: undefined,
        type: undefined as AffiliateTypeValue | undefined,
        status: undefined as AffiliateStatusType | undefined,
        websiteUrl: undefined,
        telegram: undefined,
        introduction: undefined,
        promotionalMethods: undefined,
        rejectionReason: undefined,
        referralCode: undefined,
        commissionRate: undefined,
        totalEarned: undefined,
        isActive: undefined,
        appliedAt: undefined,
        approvedAt: undefined,
      };
    }

    const affiliate = data.data;

    return {
      name: affiliate.name,
      avatarSrc: affiliate.avatarSrc,
      role: capitalizeWords(affiliate.type),
      joinedDate: formatDate(new Date(affiliate.createdAt)),
      // Aside props
      email: affiliate.email,
      type: affiliate.type as AffiliateTypeValue,
      status: affiliate.status as AffiliateStatusType,
      websiteUrl: affiliate.websiteUrl,
      telegram: affiliate.telegram,
      introduction: affiliate.introduction,
      promotionalMethods: affiliate.promotionalMethods,
      rejectionReason: affiliate.rejectionReason,
      referralCode: affiliate.referralCode,
      commissionRate: affiliate.commissionRate,
      totalEarned: affiliate.totalEarned,
      isActive: affiliate.isActive,
      appliedAt: formatDate(new Date(affiliate.createdAt)),
      approvedAt: affiliate.approvedAt
        ? formatDate(new Date(affiliate.approvedAt))
        : null,
    };
  }, [mock, data]);

  // Loading state
  if (isLoading && !mock) {
    return (
      <div className={clsx("space-y-6 p-5", className)}>
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
    <div className={clsx("space-y-6 p-5", className)}>
      {/* Header */}
      <HeaderUserCharacter
        name={processedData.name}
        avatarSrc={processedData.avatarSrc}
        role={processedData.role}
        joinedDate={processedData.joinedDate}
      />

      {/* Two-column layout - 1/3 aside, 2/3 details */}
      <div className="flex gap-6">
        {/* Left sidebar - fixed width */}
        <div className="w-[320px] shrink-0">
          <AsideAffiliateSummary
            name={processedData.name}
            email={processedData.email}
            type={processedData.type}
            status={processedData.status}
            websiteUrl={processedData.websiteUrl}
            telegram={processedData.telegram}
            introduction={processedData.introduction}
            promotionalMethods={processedData.promotionalMethods}
            rejectionReason={processedData.rejectionReason}
            referralCode={processedData.referralCode}
            commissionRate={processedData.commissionRate}
            totalEarned={processedData.totalEarned}
            isActive={processedData.isActive}
            appliedAt={processedData.appliedAt}
            approvedAt={processedData.approvedAt}
          />
        </div>

        {/* Right content area */}
        <div className="flex-1 space-y-6">
          {/* Application Details card */}
          <div className="bg-muted rounded-lg p-6">
            {/* Card header */}
            <div className="mb-6 flex items-center gap-2">
              <FileText className="text-muted-foreground size-5" />
              <h2 className="text-foreground text-lg font-semibold">
                Application Overview
              </h2>
            </div>

            {/* Application content */}
            <div className="space-y-6">
              {processedData.introduction && (
                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium uppercase">
                    Introduction
                  </h3>
                  <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                    {processedData.introduction}
                  </p>
                </div>
              )}

              {processedData.promotionalMethods && (
                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium uppercase">
                    Promotional Methods
                  </h3>
                  <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                    {processedData.promotionalMethods}
                  </p>
                </div>
              )}

              {!processedData.introduction &&
                !processedData.promotionalMethods && (
                  <div className="text-muted-foreground py-8 text-center">
                    <FileText className="mx-auto mb-2 size-8 opacity-50" />
                    <p>No additional application details provided.</p>
                  </div>
                )}

              {/* Website link */}
              {processedData.websiteUrl && (
                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium uppercase">
                    Website
                  </h3>
                  <a
                    href={processedData.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 text-sm underline"
                  >
                    {processedData.websiteUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Referrals Section */}
          {!mock && (
            <div className="bg-muted rounded-lg p-6">
              {/* Card header */}
              <div className="mb-6 flex items-center gap-2">
                <Users className="text-muted-foreground size-5" />
                <h2 className="text-foreground text-lg font-semibold">
                  Referrals
                </h2>
                {referralsData?.data?.pagination?.total !== undefined && (
                  <span className="text-muted-foreground text-sm">
                    ({referralsData.data.pagination.total})
                  </span>
                )}
              </div>

              {/* Referrals table */}
              <TableReferral
                loading={isLoadingReferrals}
                totalDocs={referralsData?.data?.pagination?.total ?? 0}
                data={referralsData?.data?.referrals ?? []}
                pagination={referralsData?.data?.pagination}
                sorting={referralsSorting}
                onSortingChange={setReferralsSorting}
                onPageChange={setReferralsPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const DashboardAffiliatesIdPage: React.FC<DashboardAffiliatesIdPageProps> = (
  props,
) => {
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
      <DashboardAffiliatesIdPageContent {...props} />
    </Suspense>
  );
};

export default DashboardAffiliatesIdPage;
