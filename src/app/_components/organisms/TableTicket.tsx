"use client";

import React from "react";
import clsx from "clsx";
import Link from "next/link";
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
  EyeIcon,
  EllipsisVerticalIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export type TicketStatusType = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriorityType = "low" | "normal" | "high" | "urgent";
export type TicketCategoryType =
  | "billing"
  | "technical"
  | "account"
  | "content"
  | "other";

export type TableTicketItem = {
  id: string;
  subject: string;
  userName: string;
  userEmail: string;
  userAvatarSrc?: string | null;
  assignedToId?: string | null;
  assignedToName?: string | null;
  assignedToAvatarSrc?: string | null;
  status: TicketStatusType;
  priority: TicketPriorityType;
  category: TicketCategoryType;
  createdAt: string;
};

export type TableTicketProps = {
  className?: string;
  loading: boolean;
  totalDocs: number;
  data: TableTicketItem[];
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
  onAssign?: (id: string) => void;
  onClose?: (id: string) => void;
  onResolve?: (id: string) => void;
  onReopen?: (id: string) => void;
  onMarkUnresolved?: (id: string) => void;
};

const STATUS_LABELS: Record<TicketStatusType, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const PRIORITY_LABELS: Record<TicketPriorityType, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

const CATEGORY_LABELS: Record<TicketCategoryType, string> = {
  billing: "Billing",
  technical: "Technical",
  account: "Account",
  content: "Content",
  other: "Other",
};

const getStatusColor = (
  status: TicketStatusType,
): "amber" | "blue" | "green" | "zinc" => {
  switch (status) {
    case "open":
      return "amber";
    case "in_progress":
      return "blue";
    case "resolved":
      return "green";
    case "closed":
      return "zinc";
    default:
      return "zinc";
  }
};

const getPriorityColor = (
  priority: TicketPriorityType,
): "zinc" | "blue" | "amber" | "red" => {
  switch (priority) {
    case "low":
      return "zinc";
    case "normal":
      return "blue";
    case "high":
      return "amber";
    case "urgent":
      return "red";
    default:
      return "zinc";
  }
};

const getCategoryColor = (
  category: TicketCategoryType,
): "green" | "purple" | "cyan" | "pink" | "zinc" => {
  switch (category) {
    case "billing":
      return "green";
    case "technical":
      return "purple";
    case "account":
      return "cyan";
    case "content":
      return "pink";
    case "other":
      return "zinc";
    default:
      return "zinc";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const TableTicket: React.FC<TableTicketProps> = ({
  className,
  loading,
  totalDocs,
  data,
  pagination,
  sorting,
  columnFilters,
  onSortingChange,
  onPageChange,
  onAssign,
  onClose,
  onResolve,
  onReopen,
  onMarkUnresolved,
}) => {
  const columnHelper = createColumnHelper<TableTicketItem>();

  const columns = [
    // TICKET Column - Subject + User info
    columnHelper.accessor("subject", {
      header: "Ticket",
      enableSorting: true,
      cell: (info) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={info.row.original.userAvatarSrc}
            initials={info.row.original.userName.charAt(0).toUpperCase()}
            alt={info.row.original.userName}
            className="size-10"
          />
          <div className="flex flex-col">
            <span className="text-foreground line-clamp-1 font-medium">
              {info.getValue()}
            </span>
            <span className="text-muted-foreground text-sm">
              {info.row.original.userName}
            </span>
          </div>
        </div>
      ),
    }),

    // CATEGORY Column - Badge
    columnHelper.accessor("category", {
      header: "Category",
      enableSorting: true,
      cell: (info) => (
        <Badge color={getCategoryColor(info.getValue())}>
          {CATEGORY_LABELS[info.getValue()]}
        </Badge>
      ),
    }),

    // PRIORITY Column - Badge
    columnHelper.accessor("priority", {
      header: "Priority",
      enableSorting: true,
      cell: (info) => (
        <Badge color={getPriorityColor(info.getValue())}>
          {PRIORITY_LABELS[info.getValue()]}
        </Badge>
      ),
    }),

    // STATUS Column - Badge
    columnHelper.accessor("status", {
      header: "Status",
      enableSorting: true,
      cell: (info) => (
        <Badge color={getStatusColor(info.getValue())}>
          {STATUS_LABELS[info.getValue()]}
        </Badge>
      ),
    }),

    // ASSIGNED TO Column - Avatar + Name or "Unassigned"
    columnHelper.accessor("assignedToName", {
      header: "Assigned To",
      enableSorting: true,
      cell: (info) => {
        const assignedName = info.getValue();
        const assignedAvatar = info.row.original.assignedToAvatarSrc;

        if (!assignedName) {
          return (
            <span className="text-muted-foreground text-sm italic">
              Unassigned
            </span>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <Avatar
              src={assignedAvatar}
              initials={assignedName.charAt(0).toUpperCase()}
              alt={assignedName}
              className="size-6"
            />
            <span className="text-foreground text-sm">{assignedName}</span>
          </div>
        );
      },
    }),

    // CREATED AT Column - Formatted date
    columnHelper.accessor("createdAt", {
      header: "Created At",
      enableSorting: true,
      cell: (info) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(info.getValue())}
        </span>
      ),
    }),

    // ACTIONS Column - View + Dropdown with other actions
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const { status, assignedToName } = info.row.original;
        const isOpen = status === "open";
        const isInProgress = status === "in_progress";
        const isResolved = status === "resolved";
        const isClosed = status === "closed";
        // Can assign/reassign if ticket is not closed or resolved
        const canAssign = !isClosed && !isResolved;
        const isReassign = !!assignedToName;
        const canResolve = isOpen || isInProgress;
        const canMarkUnresolved = isResolved;
        const canReopen = isClosed;
        const canClose = !isClosed;
        const hasDropdownActions =
          canAssign || canResolve || canMarkUnresolved || canReopen || canClose;

        return (
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/dashboard/tickets/${info.row.original.id}`}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1.5 transition-colors"
              aria-label="View ticket details"
            >
              <EyeIcon className="size-4" />
            </Link>
            {hasDropdownActions && (
              <Dropdown>
                <DropdownButton plain className="p-1.5">
                  <EllipsisVerticalIcon className="size-4" />
                </DropdownButton>
                <DropdownMenu anchor="bottom end">
                  {canAssign && (
                    <DropdownItem
                      onClick={() => onAssign?.(info.row.original.id)}
                    >
                      <UserPlusIcon className="size-4" />
                      {isReassign ? "Reassign" : "Assign"}
                    </DropdownItem>
                  )}
                  {canResolve && (
                    <DropdownItem
                      onClick={() => onResolve?.(info.row.original.id)}
                    >
                      <CheckCircleIcon className="size-4" />
                      Resolve
                    </DropdownItem>
                  )}
                  {canMarkUnresolved && (
                    <DropdownItem
                      onClick={() => onMarkUnresolved?.(info.row.original.id)}
                    >
                      <ArrowPathIcon className="size-4" />
                      Mark Unresolved
                    </DropdownItem>
                  )}
                  {canReopen && (
                    <DropdownItem
                      onClick={() => onReopen?.(info.row.original.id)}
                    >
                      <ArrowPathIcon className="size-4" />
                      Reopen
                    </DropdownItem>
                  )}
                  {canClose && (
                    <DropdownItem
                      onClick={() => onClose?.(info.row.original.id)}
                    >
                      <XCircleIcon className="size-4" />
                      Close
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        );
      },
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
                <div className="bg-muted-foreground/20 h-4 w-48 rounded" />
                <div className="bg-muted-foreground/20 h-3 w-32 rounded" />
              </div>
              <div className="bg-muted-foreground/20 h-6 w-20 rounded-full" />
              <div className="bg-muted-foreground/20 h-6 w-16 rounded-full" />
              <div className="bg-muted-foreground/20 h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Third child: Empty state */}
      <CardEmptyState
        title="No tickets found"
        description="There are no support tickets to display at this time."
      />
    </WrapperLoader>
  );
};

export default TableTicket;
