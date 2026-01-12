"use client";

import React from "react";
import clsx from "clsx";
import {
  createColumnHelper,
  type SortingState,
  type OnChangeFn,
  type ColumnFilter,
} from "@tanstack/react-table";
import TableReact from "./TableReact";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";
import { Avatar } from "../atoms/avatar";
import { Badge } from "../atoms/badge";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "../atoms/dropdown";
import {
  ShieldCheck,
  User,
  Trash2,
  Eye,
  MoreVertical,
  CircleUser,
} from "lucide-react";

export type UserRoleType = "default" | "admin" | "superadmin";
export type UserSubscriptionType = "yearly" | "monthly" | "none";
export type UserStatusType = "pending" | "active" | "inactive";

export type TableUserItem = {
  id: string;
  name: string;
  username: string;
  avatarSrc?: string;
  role: UserRoleType;
  customRoleName?: string;
  subscription: UserSubscriptionType;
  status: UserStatusType;
};

export type TableUserProps = {
  className?: string;
  loading: boolean;
  totalDocs: number;
  data: TableUserItem[];
  pagination?: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
  sorting?: SortingState;
  columnFilters?: ColumnFilter[];
  onSortingChange?: OnChangeFn<SortingState>;
  onPageChange?: (page: number) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onMore?: (id: string) => void;
};

const getRoleIcon = (role: UserRoleType) => {
  const iconClass = "text-muted-foreground size-4";
  switch (role) {
    case "superadmin":
      return <ShieldCheck className={iconClass} />;
    case "admin":
      return <ShieldCheck className={iconClass} />;
    case "default":
      return <User className={iconClass} />;
    default:
      return <CircleUser className={iconClass} />;
  }
};

const formatSubscription = (subscription: UserSubscriptionType): string => {
  switch (subscription) {
    case "yearly":
      return "Yearly";
    case "monthly":
      return "Monthly";
    case "none":
      return "None";
    default:
      return subscription;
  }
};

const getStatusColor = (status: UserStatusType): "amber" | "green" | "zinc" => {
  switch (status) {
    case "pending":
      return "amber";
    case "active":
      return "green";
    case "inactive":
      return "zinc";
    default:
      return "zinc";
  }
};

const TableUser: React.FC<TableUserProps> = ({
  className,
  loading,
  totalDocs,
  data,
  pagination,
  sorting,
  columnFilters,
  onSortingChange,
  onPageChange,
  onDelete,
  onView,
  onMore,
}) => {
  const columnHelper = createColumnHelper<TableUserItem>();

  const columns = [
    // USER Column - Avatar + Name + Username
    columnHelper.accessor("name", {
      header: "User",
      enableSorting: true,
      cell: (info) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={info.row.original.avatarSrc}
            initials={info.row.original.name.charAt(0).toUpperCase()}
            alt={info.row.original.name}
            className="size-10"
          />
          <div className="flex flex-col">
            <span className="text-foreground font-medium">
              {info.getValue()}
            </span>
            <span className="text-muted-foreground text-sm">
              {info.row.original.username}
            </span>
          </div>
        </div>
      ),
    }),

    // ROLE Column - Icon + Text
    columnHelper.accessor("role", {
      header: "Role",
      enableSorting: true,
      cell: (info) => {
        const role = info.getValue();
        const customRoleName = info.row.original.customRoleName;
        const displayRole = customRoleName ?? role;
        return (
          <div className="flex items-center gap-2">
            {getRoleIcon(role)}
            <span className="capitalize">{displayRole}</span>
          </div>
        );
      },
    }),

    // SUBSCRIPTION Column
    columnHelper.accessor("subscription", {
      header: "Subscription",
      enableSorting: true,
      cell: (info) => formatSubscription(info.getValue()),
    }),

    // STATUS Column - Badge
    columnHelper.accessor("status", {
      header: "Status",
      enableSorting: true,
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge color={getStatusColor(status)}>
            <span className="capitalize">{status}</span>
          </Badge>
        );
      },
    }),

    // ACTION Column - Delete, View, More buttons
    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: (info) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onDelete?.(info.row.original.id)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1.5 transition-colors"
            aria-label="Delete user"
          >
            <Trash2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onView?.(info.row.original.id)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1.5 transition-colors"
            aria-label="View user"
          >
            <Eye className="size-4" />
          </button>
          <Dropdown>
            <DropdownButton plain className="p-1.5">
              <MoreVertical className="size-4" />
            </DropdownButton>
            <DropdownMenu anchor="bottom end">
              <DropdownItem onClick={() => onMore?.(info.row.original.id)}>
                More options
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ),
    }),
  ];

  return (
    <WrapperLoader
      className={clsx(className)}
      loading={loading}
      totalDocs={totalDocs}
    >
      {/* First child: Actual content */}
      <TableReact
        columns={columns}
        data={data}
        pagination={pagination}
        sorting={sorting}
        columnFilters={columnFilters}
        onSortingChange={onSortingChange}
        onPageChange={onPageChange}
      />

      {/* Second child: Loading skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-muted animate-pulse rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              <div className="bg-muted-foreground/20 size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="bg-muted-foreground/20 h-4 w-32 rounded" />
                <div className="bg-muted-foreground/20 h-3 w-24 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Third child: Empty state */}
      <CardEmptyState
        title="No users found"
        description="There are no users to display at this time."
      />
    </WrapperLoader>
  );
};

export default TableUser;
