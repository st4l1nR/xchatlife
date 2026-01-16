"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import clsx from "clsx";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import TableReferral from "../organisms/TableReferral";
import StatsAffiliates from "../molecules/StatsAffiliates";
import { Input, InputGroup } from "../atoms/input";
import { Listbox, ListboxOption, ListboxLabel } from "../atoms/listbox";
import { Button } from "../atoms/button";
import { Field, Label } from "../atoms/fieldset";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../atoms/dialog";
import { api } from "@/trpc/react";
import type {
  TableReferralItem,
  ReferralStatusType,
} from "../organisms/TableReferral";

// Filter options
const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "converted", label: "Converted" },
  { value: "paid", label: "Paid" },
] as const;

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
] as const;

export type DashboardReferralsPageMockData = {
  referrals: TableReferralItem[];
  pagination: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
};

export type DashboardReferralsPageProps = {
  className?: string;
  mock?: DashboardReferralsPageMockData;
};

function DashboardReferralsPageContent({
  className,
  mock,
}: DashboardReferralsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL params
  const statusParam = searchParams.get("status") ?? "";
  const affiliateParam = searchParams.get("affiliate") ?? "";
  const searchParam = searchParams.get("search") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const sizeParam = searchParams.get("size") ?? "10";

  // Dialog state
  const [isMarkPaidDialogOpen, setIsMarkPaidDialogOpen] = useState(false);
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(
    null,
  );

  // Update URL params helper
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // Filter handlers
  const handleStatusChange = useCallback(
    (value: string) => {
      updateParams({ status: value, page: "1" });
    },
    [updateParams],
  );

  const handleAffiliateChange = useCallback(
    (value: string) => {
      updateParams({ affiliate: value, page: "1" });
    },
    [updateParams],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateParams({ search: e.target.value, page: "1" });
    },
    [updateParams],
  );

  const handlePageSizeChange = useCallback(
    (value: string) => {
      updateParams({ size: value, page: "1" });
    },
    [updateParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateParams({ page: page.toString() });
    },
    [updateParams],
  );

  // Fetch approved affiliates for filter dropdown (disabled when using mock data)
  const { data: affiliatesData } = api.referral.getApprovedAffiliates.useQuery(
    undefined,
    {
      enabled: !mock,
      staleTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
    },
  );

  // Build affiliate filter options
  const affiliateFilterOptions = useMemo(() => {
    const options = [{ value: "", label: "All Affiliates" }];
    if (affiliatesData?.data) {
      affiliatesData.data.forEach((affiliate) => {
        options.push({
          value: affiliate.id,
          label: affiliate.name,
        });
      });
    }
    return options;
  }, [affiliatesData]);

  // Fetch referrals (disabled when using mock data)
  const { data: referralsData, isLoading } =
    api.referral.getForDashboard.useQuery(
      {
        page: pageParam,
        limit: parseInt(sizeParam, 10),
        search: searchParam || undefined,
        status: (statusParam as ReferralStatusType) || undefined,
        affiliateId: affiliateParam || undefined,
      },
      {
        enabled: !mock,
      },
    );

  const utils = api.useUtils();

  // Mark as paid mutation
  const markAsPaid = api.referral.markAsPaid.useMutation({
    onSuccess: () => {
      toast.success("Referral marked as paid successfully");
      void utils.referral.getForDashboard.invalidate();
      setIsMarkPaidDialogOpen(false);
      setSelectedReferralId(null);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to mark referral as paid");
    },
  });

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      // Apply client-side filtering for mock data
      let filtered = mock.referrals;

      if (statusParam) {
        filtered = filtered.filter((r) => r.status === statusParam);
      }
      if (affiliateParam) {
        filtered = filtered.filter((r) => r.affiliateId === affiliateParam);
      }
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.referredUserName.toLowerCase().includes(searchLower) ||
            r.referredUserEmail.toLowerCase().includes(searchLower) ||
            r.affiliateName.toLowerCase().includes(searchLower) ||
            r.affiliateEmail.toLowerCase().includes(searchLower),
        );
      }

      // Apply pagination
      const pageSize = parseInt(sizeParam, 10);
      const startIndex = (pageParam - 1) * pageSize;
      const paginatedReferrals = filtered.slice(
        startIndex,
        startIndex + pageSize,
      );

      return {
        referrals: paginatedReferrals,
        totalDocs: filtered.length,
        pagination: {
          page: pageParam,
          total: filtered.length,
          totalPage: Math.ceil(filtered.length / pageSize),
          size: pageSize,
        },
      };
    }

    // Transform API data to match TableReferralItem type
    const referrals: TableReferralItem[] =
      referralsData?.data?.referrals.map((referral) => ({
        id: referral.id,
        referredUserName: referral.referredUserName,
        referredUserEmail: referral.referredUserEmail,
        referredUserAvatarSrc: referral.referredUserAvatarSrc,
        affiliateName: referral.affiliateName,
        affiliateEmail: referral.affiliateEmail,
        affiliateAvatarSrc: referral.affiliateAvatarSrc,
        affiliateId: referral.affiliateId,
        status: referral.status as ReferralStatusType,
        commission: referral.commission,
        convertedAt: referral.convertedAt,
        paidAt: referral.paidAt,
        createdAt: referral.createdAt,
      })) ?? [];

    return {
      referrals,
      totalDocs: referralsData?.data?.pagination.total ?? 0,
      pagination: referralsData?.data?.pagination
        ? {
            page: referralsData.data.pagination.page,
            total: referralsData.data.pagination.total,
            totalPage: referralsData.data.pagination.totalPage,
            size: referralsData.data.pagination.size,
          }
        : undefined,
    };
  }, [
    mock,
    referralsData,
    statusParam,
    affiliateParam,
    searchParam,
    pageParam,
    sizeParam,
  ]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const data = mock ? mock.referrals : processedData.referrals;
    const pendingCount = data.filter((r) => r.status === "pending").length;
    const convertedCount = data.filter((r) => r.status === "converted").length;
    const pendingPayment = data
      .filter((r) => r.status === "converted")
      .reduce((sum, r) => sum + r.commission, 0);

    return {
      pendingCount,
      convertedCount,
      pendingPayment,
    };
  }, [mock, processedData.referrals]);

  // Action handlers
  const handleMarkAsPaid = useCallback((id: string) => {
    setSelectedReferralId(id);
    setIsMarkPaidDialogOpen(true);
  }, []);

  const handleConfirmMarkAsPaid = useCallback(() => {
    if (selectedReferralId) {
      if (mock) {
        // Simulate API call for mock mode
        toast.success("Referral marked as paid successfully");
        setIsMarkPaidDialogOpen(false);
        setSelectedReferralId(null);
      } else {
        markAsPaid.mutate({ id: selectedReferralId });
      }
    }
  }, [selectedReferralId, mock, markAsPaid]);

  const selectedReferral = useMemo(() => {
    if (mock) {
      return mock.referrals.find((r) => r.id === selectedReferralId);
    }
    return processedData.referrals.find((r) => r.id === selectedReferralId);
  }, [mock, selectedReferralId, processedData.referrals]);

  const isMarkingAsPaid = markAsPaid.isPending;

  return (
    <div className={clsx("space-y-6 p-5", className)}>
      {/* Summary Stats */}
      <StatsAffiliates
        stats={[
          { label: "Total Referrals", value: processedData.totalDocs },
          { label: "Pending Conversion", value: summaryStats.pendingCount },
          { label: "Awaiting Payment", value: summaryStats.convertedCount },
          {
            label: "Pending Payout",
            value: `$${summaryStats.pendingPayment.toFixed(2)}`,
          },
        ]}
      />

      {/* Filters Card */}
      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Filters</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Status Filter */}
          <Field>
            <Label>Status</Label>
            <Listbox value={statusParam} onChange={handleStatusChange}>
              {STATUS_FILTER_OPTIONS.map((option) => (
                <ListboxOption key={option.value} value={option.value}>
                  <ListboxLabel>{option.label}</ListboxLabel>
                </ListboxOption>
              ))}
            </Listbox>
          </Field>

          {/* Affiliate Filter */}
          <Field>
            <Label>Affiliate</Label>
            <Listbox value={affiliateParam} onChange={handleAffiliateChange}>
              {(mock
                ? [
                    { value: "", label: "All Affiliates" },
                    ...Array.from(
                      new Map(
                        mock.referrals.map((r) => [
                          r.affiliateId,
                          { value: r.affiliateId, label: r.affiliateName },
                        ]),
                      ).values(),
                    ),
                  ]
                : affiliateFilterOptions
              ).map((option) => (
                <ListboxOption key={option.value} value={option.value}>
                  <ListboxLabel>{option.label}</ListboxLabel>
                </ListboxOption>
              ))}
            </Listbox>
          </Field>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <Listbox
            value={sizeParam}
            onChange={handlePageSizeChange}
            className="w-20"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>
        </div>

        {/* Search Input */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <InputGroup>
            <Search data-slot="icon" className="text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search referrals..."
              value={searchParam}
              onChange={handleSearchChange}
              className="w-full max-w-xs"
            />
          </InputGroup>
        </div>
      </div>

      {/* Table */}
      <TableReferral
        loading={isLoading && !mock}
        totalDocs={processedData.totalDocs}
        data={processedData.referrals}
        pagination={processedData.pagination}
        onPageChange={handlePageChange}
        onMarkAsPaid={handleMarkAsPaid}
      />

      {/* Mark as Paid Dialog */}
      <Dialog
        open={isMarkPaidDialogOpen}
        onClose={() => {
          if (!isMarkingAsPaid) {
            setIsMarkPaidDialogOpen(false);
            setSelectedReferralId(null);
          }
        }}
        size="md"
      >
        <DialogTitle>Mark Referral as Paid</DialogTitle>
        <DialogDescription>
          Are you sure you want to mark this referral commission as paid?
        </DialogDescription>
        <DialogBody>
          {selectedReferral && (
            <div className="bg-muted space-y-3 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Referred User:</span>
                <span className="font-medium">
                  {selectedReferral.referredUserName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Affiliate:</span>
                <span className="font-medium">
                  {selectedReferral.affiliateName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commission:</span>
                <span className="font-bold text-green-600">
                  $
                  {selectedReferral.commission.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setIsMarkPaidDialogOpen(false);
              setSelectedReferralId(null);
            }}
            disabled={isMarkingAsPaid}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleConfirmMarkAsPaid}
            loading={isMarkingAsPaid}
          >
            <DollarSign data-slot="icon" />
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const DashboardReferralsPage: React.FC<DashboardReferralsPageProps> = (
  props,
) => {
  return (
    <Suspense fallback={<div className="animate-pulse p-5">Loading...</div>}>
      <DashboardReferralsPageContent {...props} />
    </Suspense>
  );
};

export default DashboardReferralsPage;
