"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import clsx from "clsx";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import TablePlan from "../organisms/TablePlan";
import DialogCreateUpdatePlan from "../organisms/DialogCreateUpdatePlan";
import type { ExistingPlan } from "../organisms/DialogCreateUpdatePlan";
import type { TablePlanItem, BillingCycleValue } from "../organisms/TablePlan";
import { Listbox, ListboxOption, ListboxLabel } from "../atoms/listbox";
import { Button } from "../atoms/button";
import { api } from "@/trpc/react";

// Filter options
const BILLING_CYCLE_FILTER_OPTIONS = [
  { value: "", label: "All Billing Cycles" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
] as const;

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
] as const;

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
] as const;

export type DashboardPlansPageMockData = {
  plans: TablePlanItem[];
  pagination: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
};

export type DashboardPlansPageProps = {
  className?: string;
  mock?: DashboardPlansPageMockData;
};

function DashboardPlansPageContent({
  className,
  mock,
}: DashboardPlansPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL params
  const billingCycleParam = searchParams.get("billingCycle") ?? "";
  const statusParam = searchParams.get("status") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const sizeParam = searchParams.get("size") ?? "10";

  // Dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "update">("create");
  const [selectedPlan, setSelectedPlan] = useState<ExistingPlan | undefined>();
  const [togglingId, setTogglingId] = useState<string | undefined>();

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
  const handleBillingCycleChange = useCallback(
    (value: string) => {
      updateParams({ billingCycle: value, page: "1" });
    },
    [updateParams],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      updateParams({ status: value, page: "1" });
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

  const utils = api.useUtils();

  // Fetch plans (disabled when using mock data)
  const { data: plansData, isLoading } =
    api.subscription.getPlansAdmin.useQuery(
      {
        page: pageParam,
        limit: parseInt(sizeParam, 10),
        billingCycle: (billingCycleParam as BillingCycleValue) || undefined,
        isActive:
          statusParam === "true"
            ? true
            : statusParam === "false"
              ? false
              : undefined,
      },
      {
        enabled: !mock,
      },
    );

  // Toggle active mutation
  const updatePlan = api.subscription.updatePlan.useMutation({
    onSuccess: () => {
      toast.success("Plan status updated");
      void utils.subscription.invalidate();
      setTogglingId(undefined);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update plan status");
      setTogglingId(undefined);
    },
  });

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      // Apply client-side filtering for mock data
      let filtered = mock.plans;

      if (billingCycleParam) {
        filtered = filtered.filter((p) => p.billingCycle === billingCycleParam);
      }
      if (statusParam) {
        const isActive = statusParam === "true";
        filtered = filtered.filter((p) => p.isActive === isActive);
      }

      // Apply pagination
      const pageSize = parseInt(sizeParam, 10);
      const startIndex = (pageParam - 1) * pageSize;
      const paginatedPlans = filtered.slice(startIndex, startIndex + pageSize);

      return {
        plans: paginatedPlans,
        totalDocs: filtered.length,
        pagination: {
          page: pageParam,
          total: filtered.length,
          totalPage: Math.ceil(filtered.length / pageSize),
          size: pageSize,
        },
      };
    }

    const plans: TablePlanItem[] = plansData?.data?.plans ?? [];

    return {
      plans,
      totalDocs: plansData?.data?.pagination?.total ?? 0,
      pagination: plansData?.data?.pagination
        ? {
            page: plansData.data.pagination.page,
            total: plansData.data.pagination.total,
            totalPage: plansData.data.pagination.totalPages,
            size: parseInt(sizeParam, 10),
          }
        : undefined,
    };
  }, [mock, plansData, billingCycleParam, statusParam, pageParam, sizeParam]);

  // Action handlers
  const handleCreate = useCallback(() => {
    setSelectedPlan(undefined);
    setDialogMode("create");
    setIsCreateDialogOpen(true);
  }, []);

  const handleEdit = useCallback(
    (id: string) => {
      const plan = processedData.plans.find((p) => p.id === id);
      if (plan) {
        setSelectedPlan({
          id: plan.id,
          label: plan.label,
          billingCycle: plan.billingCycle,
          months: plan.months,
          price: plan.price,
          pricePerMonth: plan.pricePerMonth,
          tokensGranted: plan.tokensGranted,
          discount: plan.discount,
          isActive: plan.isActive,
        });
        setDialogMode("update");
        setIsCreateDialogOpen(true);
      }
    },
    [processedData.plans],
  );

  const handleToggleActive = useCallback(
    (id: string, isActive: boolean) => {
      setTogglingId(id);
      updatePlan.mutate({ id, isActive });
    },
    [updatePlan],
  );

  const handleCloseCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(false);
    setSelectedPlan(undefined);
  }, []);

  return (
    <div className={clsx("space-y-6 p-5", className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">
            Subscription Plans
          </h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            Manage subscription plans for your users. Plans are synced with the
            payment provider (NOWPayments) automatically.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus data-slot="icon" />
          Create Plan
        </Button>
      </div>

      {/* Filters Card */}
      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Filters</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Billing Cycle Filter */}
          <Listbox
            value={billingCycleParam}
            onChange={handleBillingCycleChange}
          >
            {BILLING_CYCLE_FILTER_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Status Filter */}
          <Listbox value={statusParam} onChange={handleStatusChange}>
            {STATUS_FILTER_OPTIONS.map((option) => (
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
          <span className="text-muted-foreground text-sm">per page</span>
        </div>

        {/* Total count */}
        <span className="text-muted-foreground text-sm">
          {processedData.totalDocs} plan
          {processedData.totalDocs !== 1 ? "s" : ""} total
        </span>
      </div>

      {/* Table */}
      <TablePlan
        loading={isLoading && !mock}
        totalDocs={processedData.totalDocs}
        data={processedData.plans}
        pagination={processedData.pagination}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        togglingId={togglingId}
      />

      {/* Create/Update Dialog */}
      <DialogCreateUpdatePlan
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        mode={dialogMode}
        existingPlan={selectedPlan}
      />
    </div>
  );
}

const DashboardPlansPage: React.FC<DashboardPlansPageProps> = (props) => {
  return (
    <Suspense fallback={<div className="animate-pulse p-5">Loading...</div>}>
      <DashboardPlansPageContent {...props} />
    </Suspense>
  );
};

export default DashboardPlansPage;
