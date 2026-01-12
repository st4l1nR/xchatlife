"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import clsx from "clsx";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Plus } from "lucide-react";
import toast from "react-hot-toast";
import TableUser from "../organisms/TableUser";
import DialogCreateUpdateUser from "../organisms/DialogCreateUpdateUser";
import DialogDeleteUser from "../organisms/DialogDeleteUser";
import { Button } from "../atoms/button";
import { Input, InputGroup } from "../atoms/input";
import { Listbox, ListboxOption, ListboxLabel } from "../atoms/listbox";
import { api } from "@/trpc/react";
import type {
  TableUserItem,
  UserRoleType,
  UserSubscriptionType,
  UserStatusType,
} from "../organisms/TableUser";

// Filter options
const SUBSCRIPTION_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "none", label: "None" },
] as const;

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All" },
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

  // Fetch roles for filter
  const { data: rolesData } = api.role.getAll.useQuery();

  // Build role filter options from fetched data
  const roleFilterOptions = useMemo(() => {
    const options = [{ value: "", label: "All" }];
    if (rolesData?.data) {
      rolesData.data.forEach((role) => {
        options.push({ value: role.id, label: role.name });
      });
    }
    return options;
  }, [rolesData]);

  // Parse URL params
  const roleParam = searchParams.get("role") ?? "";
  const subscriptionParam = searchParams.get("subscription") ?? "";
  const statusParam = searchParams.get("status") ?? "";
  const searchParam = searchParams.get("search") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const sizeParam = searchParams.get("size") ?? "10";

  // Dialog state
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

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

  const handleSubscriptionChange = useCallback(
    (value: string) => {
      updateParams({ subscription: value, page: "1" });
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
      customRoleId: roleParam || undefined,
    },
    {
      enabled: !mock,
    },
  );

  const utils = api.useUtils();

  // Delete user mutation
  const deleteUser = api.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("User deleted successfully");
      void utils.admin.getUsers.invalidate();
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete user");
    },
  });

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
      if (subscriptionParam) {
        filtered = filtered.filter(
          (user) => user.subscription === subscriptionParam,
        );
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
      usersData?.data?.users.map((user) => {
        // Cast to access additional fields from API
        const userWithRelations = user as typeof user & {
          customRole?: { id: string; name: string } | null;
          subscription?: {
            id: string;
            billingCycle: string;
            status: string;
          } | null;
        };

        // Map billingCycle to subscription type
        let subscription: UserSubscriptionType = "none";
        if (userWithRelations.subscription?.billingCycle) {
          const cycle = userWithRelations.subscription.billingCycle;
          if (cycle === "annually") {
            subscription = "yearly";
          } else if (cycle === "monthly") {
            subscription = "monthly";
          }
        }

        return {
          id: user.id,
          name: user.name,
          username: user.email.split("@")[0] ?? user.email,
          avatarSrc: user.image ?? undefined,
          role: (user.role as UserRoleType) ?? "default",
          customRoleName: userWithRelations.customRole?.name,
          subscription,
          status: "active" as UserStatusType,
        };
      }) ?? [];

    // Apply client-side filtering for subscription/status (role is filtered by API)
    let filtered = users;
    if (subscriptionParam) {
      filtered = filtered.filter(
        (user) => user.subscription === subscriptionParam,
      );
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
    subscriptionParam,
    statusParam,
    searchParam,
    pageParam,
    sizeParam,
  ]);

  // Action handlers
  const handleDelete = useCallback(
    (id: string) => {
      const user = processedData.users.find((u) => u.id === id);
      setUserToDelete({ id, name: user?.name ?? "Unknown" });
      setIsDeleteDialogOpen(true);
    },
    [processedData.users],
  );

  const handleConfirmDelete = useCallback(() => {
    if (userToDelete) {
      deleteUser.mutate({ userId: userToDelete.id });
    }
  }, [userToDelete, deleteUser]);

  const handleView = useCallback(
    (id: string) => {
      router.push(`/dashboard/users/${id}`);
    },
    [router],
  );

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
            {roleFilterOptions.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Subscription Filter */}
          <Listbox
            value={subscriptionParam}
            onChange={handleSubscriptionChange}
          >
            {SUBSCRIPTION_FILTER_OPTIONS.map((option) => (
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

      {/* Delete Confirmation Dialog */}
      <DialogDeleteUser
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteUser.isPending}
        userName={userToDelete?.name}
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
