"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import clsx from "clsx";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import TableAffiliate from "../organisms/TableAffiliate";
import { Input, InputGroup } from "../atoms/input";
import { Listbox, ListboxOption, ListboxLabel } from "../atoms/listbox";
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from "../atoms/alert";
import { Button } from "../atoms/button";
import { Field, Label } from "../atoms/fieldset";
import { Textarea } from "../atoms/textarea";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../atoms/dialog";
import { api } from "@/trpc/react";
import type {
  TableAffiliateItem,
  AffiliateStatusType,
  AffiliateTypeValue,
} from "../organisms/TableAffiliate";

// Filter options
const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

const TYPE_FILTER_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "influencer", label: "Influencer" },
  { value: "blogger", label: "Blogger" },
  { value: "youtuber", label: "YouTuber" },
  { value: "social_media", label: "Social Media" },
  { value: "website_owner", label: "Website Owner" },
  { value: "email_marketing", label: "Email Marketing" },
  { value: "other", label: "Other" },
] as const;

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
] as const;

export type DashboardAffiliatesPageMockData = {
  affiliates: TableAffiliateItem[];
  pagination: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
};

export type DashboardAffiliatesPageProps = {
  className?: string;
  mock?: DashboardAffiliatesPageMockData;
};

function DashboardAffiliatesPageContent({
  className,
  mock,
}: DashboardAffiliatesPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL params
  const statusParam = searchParams.get("status") ?? "";
  const typeParam = searchParams.get("type") ?? "";
  const searchParam = searchParams.get("search") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const sizeParam = searchParams.get("size") ?? "10";

  // Dialog state
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<string | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");

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

  const handleTypeChange = useCallback(
    (value: string) => {
      updateParams({ type: value, page: "1" });
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

  // Fetch affiliates (disabled when using mock data)
  const { data: affiliatesData, isLoading } =
    api.affiliate.getForDashboard.useQuery(
      {
        page: pageParam,
        limit: parseInt(sizeParam, 10),
        search: searchParam || undefined,
        status: (statusParam as AffiliateStatusType) || undefined,
        type: (typeParam as AffiliateTypeValue) || undefined,
      },
      {
        enabled: !mock,
      },
    );

  const utils = api.useUtils();

  // Approve affiliate mutation
  const approveAffiliate = api.affiliate.approve.useMutation({
    onSuccess: () => {
      toast.success("Affiliate approved successfully");
      void utils.affiliate.getForDashboard.invalidate();
      setIsApproveDialogOpen(false);
      setSelectedAffiliateId(null);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to approve affiliate");
    },
  });

  // Reject affiliate mutation
  const rejectAffiliate = api.affiliate.reject.useMutation({
    onSuccess: () => {
      toast.success("Affiliate rejected");
      void utils.affiliate.getForDashboard.invalidate();
      setIsRejectDialogOpen(false);
      setSelectedAffiliateId(null);
      setRejectionReason("");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to reject affiliate");
    },
  });

  // Get single affiliate for view dialog
  const { data: selectedAffiliateData } = api.affiliate.getById.useQuery(
    { id: selectedAffiliateId ?? "" },
    {
      enabled: !!selectedAffiliateId && isViewDialogOpen && !mock,
    },
  );

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      // Apply client-side filtering for mock data
      let filtered = mock.affiliates;

      if (statusParam) {
        filtered = filtered.filter((a) => a.status === statusParam);
      }
      if (typeParam) {
        filtered = filtered.filter((a) => a.type === typeParam);
      }
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.name.toLowerCase().includes(searchLower) ||
            a.email.toLowerCase().includes(searchLower) ||
            a.websiteUrl.toLowerCase().includes(searchLower),
        );
      }

      // Apply pagination
      const pageSize = parseInt(sizeParam, 10);
      const startIndex = (pageParam - 1) * pageSize;
      const paginatedAffiliates = filtered.slice(
        startIndex,
        startIndex + pageSize,
      );

      return {
        affiliates: paginatedAffiliates,
        totalDocs: filtered.length,
        pagination: {
          page: pageParam,
          total: filtered.length,
          totalPage: Math.ceil(filtered.length / pageSize),
          size: pageSize,
        },
      };
    }

    // Transform API data to match TableAffiliateItem type
    const affiliates: TableAffiliateItem[] =
      affiliatesData?.data?.affiliates.map((affiliate) => ({
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        avatarSrc: affiliate.avatarSrc,
        type: affiliate.type as AffiliateTypeValue,
        websiteUrl: affiliate.websiteUrl,
        status: affiliate.status as AffiliateStatusType,
        createdAt: affiliate.createdAt,
      })) ?? [];

    return {
      affiliates,
      totalDocs: affiliatesData?.data?.pagination.total ?? 0,
      pagination: affiliatesData?.data?.pagination
        ? {
            page: affiliatesData.data.pagination.page,
            total: affiliatesData.data.pagination.total,
            totalPage: affiliatesData.data.pagination.totalPage,
            size: affiliatesData.data.pagination.size,
          }
        : undefined,
    };
  }, [
    mock,
    affiliatesData,
    statusParam,
    typeParam,
    searchParam,
    pageParam,
    sizeParam,
  ]);

  // Action handlers
  const handleApprove = useCallback((id: string) => {
    setSelectedAffiliateId(id);
    setIsApproveDialogOpen(true);
  }, []);

  const handleReject = useCallback((id: string) => {
    setSelectedAffiliateId(id);
    setIsRejectDialogOpen(true);
  }, []);

  const handleView = useCallback((id: string) => {
    setSelectedAffiliateId(id);
    setIsViewDialogOpen(true);
  }, []);

  const handleConfirmApprove = useCallback(() => {
    if (selectedAffiliateId) {
      approveAffiliate.mutate({ id: selectedAffiliateId });
    }
  }, [selectedAffiliateId, approveAffiliate]);

  const handleConfirmReject = useCallback(() => {
    if (selectedAffiliateId && rejectionReason.trim()) {
      rejectAffiliate.mutate({
        id: selectedAffiliateId,
        reason: rejectionReason.trim(),
      });
    }
  }, [selectedAffiliateId, rejectionReason, rejectAffiliate]);

  const selectedAffiliate = useMemo(() => {
    if (mock) {
      return mock.affiliates.find((a) => a.id === selectedAffiliateId);
    }
    return selectedAffiliateData?.data;
  }, [mock, selectedAffiliateId, selectedAffiliateData]);

  return (
    <div className={clsx("space-y-6 p-5", className)}>
      {/* Filters Card */}
      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Filters</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Status Filter */}
          <Listbox value={statusParam} onChange={handleStatusChange}>
            {STATUS_FILTER_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Type Filter */}
          <Listbox value={typeParam} onChange={handleTypeChange}>
            {TYPE_FILTER_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>
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
              placeholder="Search affiliates..."
              value={searchParam}
              onChange={handleSearchChange}
              className="w-full max-w-xs"
            />
          </InputGroup>
        </div>
      </div>

      {/* Table */}
      <TableAffiliate
        loading={isLoading && !mock}
        totalDocs={processedData.totalDocs}
        data={processedData.affiliates}
        pagination={processedData.pagination}
        onPageChange={handlePageChange}
        onApprove={handleApprove}
        onReject={handleReject}
        onView={handleView}
      />

      {/* Approve Confirmation Alert */}
      <Alert
        open={isApproveDialogOpen}
        onClose={() => {
          setIsApproveDialogOpen(false);
          setSelectedAffiliateId(null);
        }}
      >
        <AlertTitle>Approve Affiliate</AlertTitle>
        <AlertDescription>
          Are you sure you want to approve this affiliate application? They will
          receive a referral code and can start earning commissions.
        </AlertDescription>
        <AlertActions>
          <Button
            plain
            onClick={() => {
              setIsApproveDialogOpen(false);
              setSelectedAffiliateId(null);
            }}
            disabled={approveAffiliate.isPending}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleConfirmApprove}
            loading={approveAffiliate.isPending}
          >
            Approve
          </Button>
        </AlertActions>
      </Alert>

      {/* Reject Dialog with Reason */}
      <Dialog
        open={isRejectDialogOpen}
        onClose={() => {
          if (!rejectAffiliate.isPending) {
            setIsRejectDialogOpen(false);
            setSelectedAffiliateId(null);
            setRejectionReason("");
          }
        }}
        size="lg"
      >
        <DialogTitle>Reject Affiliate</DialogTitle>
        <DialogDescription>
          Please provide a reason for rejecting this application. This will be
          stored for your records.
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>Rejection Reason</Label>
            <Textarea
              rows={3}
              placeholder="Enter the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={rejectAffiliate.isPending}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setIsRejectDialogOpen(false);
              setSelectedAffiliateId(null);
              setRejectionReason("");
            }}
            disabled={rejectAffiliate.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleConfirmReject}
            loading={rejectAffiliate.isPending}
            disabled={!rejectionReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedAffiliateId(null);
        }}
        size="xl"
      >
        <DialogTitle>Affiliate Details</DialogTitle>
        <DialogBody className="space-y-4">
          {selectedAffiliate && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p className="font-medium">{selectedAffiliate.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{selectedAffiliate.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Type</p>
                <p className="font-medium capitalize">
                  {String(selectedAffiliate.type).replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Status</p>
                <p className="font-medium capitalize">
                  {String(selectedAffiliate.status)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground text-sm">Website</p>
                <a
                  href={selectedAffiliate.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {selectedAffiliate.websiteUrl}
                </a>
              </div>
              {selectedAffiliateData?.data?.telegram && (
                <div>
                  <p className="text-muted-foreground text-sm">Telegram</p>
                  <p className="font-medium">
                    {selectedAffiliateData.data.telegram}
                  </p>
                </div>
              )}
              {selectedAffiliateData?.data?.introduction && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-sm">Introduction</p>
                  <p className="text-sm">
                    {selectedAffiliateData.data.introduction}
                  </p>
                </div>
              )}
              {selectedAffiliateData?.data?.promotionalMethods && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-sm">
                    Promotional Methods
                  </p>
                  <p className="text-sm">
                    {selectedAffiliateData.data.promotionalMethods}
                  </p>
                </div>
              )}
              {selectedAffiliateData?.data?.referralCode && (
                <div>
                  <p className="text-muted-foreground text-sm">Referral Code</p>
                  <p className="font-mono font-medium">
                    {selectedAffiliateData.data.referralCode}
                  </p>
                </div>
              )}
              {selectedAffiliateData?.data?.rejectionReason && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-sm">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-600">
                    {selectedAffiliateData.data.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setIsViewDialogOpen(false);
              setSelectedAffiliateId(null);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const DashboardAffiliatesPage: React.FC<DashboardAffiliatesPageProps> = (
  props,
) => {
  return (
    <Suspense fallback={<div className="animate-pulse p-5">Loading...</div>}>
      <DashboardAffiliatesPageContent {...props} />
    </Suspense>
  );
};

export default DashboardAffiliatesPage;
