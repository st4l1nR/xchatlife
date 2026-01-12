"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import clsx from "clsx";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Plus } from "lucide-react";
import TableUser from "../organisms/TableUser";
import DialogCreateUpdateUser from "../organisms/DialogCreateUpdateUser";
import { Button } from "../atoms/button";
import { Input, InputGroup } from "../atoms/input";
import {
  Listbox,
  ListboxOption,
  ListboxLabel,
} from "../atoms/listbox";
import { api } from "@/trpc/react";
import type {
  TableUserItem,
  UserRoleType,
  UserPlanType,
  UserStatusType,
} from "../organisms/TableUser";

// Filter options
const ROLE_FILTER_OPTIONS = [
  { value: "", label: "Select Role" },
  { value: "default", label: "Default" },
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
] as const;

const PLAN_FILTER_OPTIONS = [
  { value: "", label: "Select Plan" },
  { value: "enterprise", label: "Enterprise" },
  { value: "team", label: "Team" },
  { value: "company", label: "Company" },
  { value: "basic", label: "Basic" },
] as const;

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "Select Status" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
] as const;

export type DashboardUsersPageMockData = {
  users: TableUserItem[];
  pagination: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
};

export type DashboardUsersPageProps = {
  className?: string;
  mock?: DashboardUsersPageMockData;
};

function DashboardUsersPageContent({
  className,
  mock,
}: DashboardUsersPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL params
  const roleParam = searchParams.get("role") ?? "";
  const planParam = searchParams.get("plan") ?? "";
  const statusParam = searchParams.get("status") ?? "";
  const searchParam = searchParams.get("search") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const sizeParam = searchParams.get("size") ?? "10";

  // Dialog state
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

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
  const handleRoleChange = useCallback(
    (value: string) => {
      updateParams({ role: value, page: "1" });
    },
    [updateParams],
  );

  const handlePlanChange = useCallback(
    (value: string) => {
      updateParams({ plan: value, page: "1" });
    },
    [updateParams],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      updateParams({ status: value, page: "1" });
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

  // Fetch users (disabled when using mock data)
  const { data: usersData, isLoading } = api.admin.getUsers.useQuery(
    {
      page: pageParam,
      limit: parseInt(sizeParam, 10),
      search: searchParam || undefined,
    },
    {
      enabled: !mock,
    },
  );

  const utils = api.useUtils();

  // Handle invite success
  const handleInviteSuccess = useCallback(() => {
    void utils.admin.getUsers.invalidate();
  }, [utils]);

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      // Apply client-side filtering for mock data
      let filtered = mock.users;

      if (roleParam) {
        filtered = filtered.filter((user) => user.role === roleParam);
      }
      if (planParam) {
        filtered = filtered.filter((user) => user.plan === planParam);
      }
      if (statusParam) {
        filtered = filtered.filter((user) => user.status === statusParam);
      }
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(searchLower) ||
            user.username.toLowerCase().includes(searchLower),
        );
      }

      // Apply pagination
      const pageSize = parseInt(sizeParam, 10);
      const startIndex = (pageParam - 1) * pageSize;
      const paginatedUsers = filtered.slice(startIndex, startIndex + pageSize);

      return {
        users: paginatedUsers,
        totalDocs: filtered.length,
        pagination: {
          page: pageParam,
          total: filtered.length,
          totalPage: Math.ceil(filtered.length / pageSize),
          size: pageSize,
        },
      };
    }

    // Transform API data to match TableUserItem type
    const users: TableUserItem[] =
      usersData?.data?.users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.email.split("@")[0] ?? user.email,
        avatarSrc: user.image ?? undefined,
        role: (user.role as UserRoleType) ?? "subscriber",
        plan: "basic" as UserPlanType,
        billing: "auto_debit" as const,
        status: "active" as UserStatusType,
      })) ?? [];

    // Apply client-side filtering for role/plan/status since API doesn't support it yet
    let filtered = users;
    if (roleParam) {
      filtered = filtered.filter((user) => user.role === roleParam);
    }
    if (planParam) {
      filtered = filtered.filter((user) => user.plan === planParam);
    }
    if (statusParam) {
      filtered = filtered.filter((user) => user.status === statusParam);
    }

    return {
      users: filtered,
      totalDocs: usersData?.data?.pagination.total ?? 0,
      pagination: usersData?.data?.pagination
        ? {
            page: usersData.data.pagination.page,
            total: usersData.data.pagination.total,
            totalPage: usersData.data.pagination.totalPages,
            size: usersData.data.pagination.limit,
          }
        : undefined,
    };
  }, [
    mock,
    usersData,
    roleParam,
    planParam,
    statusParam,
    searchParam,
    pageParam,
    sizeParam,
  ]);

  // Action handlers
  const handleDelete = useCallback((id: string) => {
    console.log("Delete user:", id);
  }, []);

  const handleView = useCallback((id: string) => {
    console.log("View user:", id);
  }, []);

  const handleMore = useCallback((id: string) => {
    console.log("More options:", id);
  }, []);

  return (
    <div className={clsx("space-y-6", className)}>
      {/* Filters Card */}
      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Filters</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Role Filter */}
          <Listbox value={roleParam} onChange={handleRoleChange}>
            {ROLE_FILTER_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Plan Filter */}
          <Listbox value={planParam} onChange={handlePlanChange}>
            {PLAN_FILTER_OPTIONS.map((option) => (
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
        </div>

        {/* Search and Invite Button */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* Search Input */}
          <InputGroup>
            <Search data-slot="icon" className="text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search User"
              value={searchParam}
              onChange={handleSearchChange}
              className="w-full max-w-xs"
            />
          </InputGroup>

          {/* Invite Button */}
          <Button
            color="primary"
            onClick={() => setIsInviteDialogOpen(true)}
            className="shrink-0"
          >
            <Plus data-slot="icon" />
            Invite New User
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableUser
        loading={isLoading && !mock}
        totalDocs={processedData.totalDocs}
        data={processedData.users}
        pagination={processedData.pagination}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
        onView={handleView}
        onMore={handleMore}
      />

      {/* Invite Dialog */}
      <DialogCreateUpdateUser
        open={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        mode="create"
        onSuccess={handleInviteSuccess}
      />
    </div>
  );
}

const DashboardUsersPage: React.FC<DashboardUsersPageProps> = (props) => {
  return (
    <Suspense fallback={<div className="animate-pulse p-6">Loading...</div>}>
      <DashboardUsersPageContent {...props} />
    </Suspense>
  );
};

export default DashboardUsersPage;
