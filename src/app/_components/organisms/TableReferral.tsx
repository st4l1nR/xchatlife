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
import { Eye, DollarSign } from "lucide-react";

export type ReferralStatusType = "pending" | "converted" | "paid";

export type TableReferralItem = {
  id: string;
  referredUserName: string;
  referredUserEmail: string;
  referredUserAvatarSrc?: string | null;
  affiliateName: string;
  affiliateEmail: string;
  affiliateAvatarSrc?: string | null;
  affiliateId: string;
  status: ReferralStatusType;
  commission: number;
  convertedAt?: string | null;
  paidAt?: string | null;
  createdAt: string;
};

export type TableReferralProps = {
  className?: string;
  loading: boolean;
  totalDocs: number;
  data: TableReferralItem[];
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
  onMarkAsPaid?: (id: string) => void;
};

const getStatusColor = (
  status: ReferralStatusType,
): "amber" | "blue" | "green" => {
  switch (status) {
    case "pending":
      return "amber";
    case "converted":
      return "blue";
    case "paid":
      return "green";
    default:
      return "amber";
  }
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const TableReferral: React.FC<TableReferralProps> = ({
  className,
  loading,
  totalDocs,
  data,
  pagination,
  sorting,
  columnFilters,
  onSortingChange,
  onPageChange,
  onMarkAsPaid,
}) => {
  const columnHelper = createColumnHelper<TableReferralItem>();

  const columns = [
    // REFERRED USER Column - Avatar + Name + Email
    columnHelper.accessor("referredUserName", {
      header: "Referred User",
      enableSorting: true,
      cell: (info) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={info.row.original.referredUserAvatarSrc}
            initials={info.row.original.referredUserName
              .charAt(0)
              .toUpperCase()}
            alt={info.row.original.referredUserName}
            className="size-10"
          />
          <div className="flex flex-col">
            <span className="text-foreground font-medium">
              {info.getValue()}
            </span>
            <span className="text-muted-foreground text-sm">
              {info.row.original.referredUserEmail}
            </span>
          </div>
        </div>
      ),
    }),

    // AFFILIATE Column - Avatar + Name + Email
    columnHelper.accessor("affiliateName", {
      header: "Affiliate",
      enableSorting: true,
      cell: (info) => (
        <Link
          href={`/dashboard/affiliates/${info.row.original.affiliateId}`}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Avatar
            src={info.row.original.affiliateAvatarSrc}
            initials={info.row.original.affiliateName.charAt(0).toUpperCase()}
            alt={info.row.original.affiliateName}
            className="size-10"
          />
          <div className="flex flex-col">
            <span className="text-foreground font-medium">
              {info.getValue()}
            </span>
            <span className="text-muted-foreground text-sm">
              {info.row.original.affiliateEmail}
            </span>
          </div>
        </Link>
      ),
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

    // COMMISSION Column - Formatted currency
    columnHelper.accessor("commission", {
      header: "Commission",
      enableSorting: true,
      cell: (info) => (
        <span className="text-foreground font-medium">
          {formatCurrency(info.getValue())}
        </span>
      ),
    }),

    // CONVERTED AT Column - Formatted date
    columnHelper.accessor("convertedAt", {
      header: "Converted At",
      enableSorting: true,
      cell: (info) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(info.getValue())}
        </span>
      ),
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

    // ACTION Column - Mark as Paid, View buttons
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const isConverted = info.row.original.status === "converted";

        return (
          <div className="flex items-center justify-end gap-1">
            {isConverted && (
              <button
                type="button"
                onClick={() => onMarkAsPaid?.(info.row.original.id)}
                className="rounded p-1.5 text-green-600 transition-colors hover:bg-green-100 dark:hover:bg-green-900/30"
                aria-label="Mark as paid"
                title="Mark as Paid"
              >
                <DollarSign className="size-4" />
              </button>
            )}
            <Link
              href={`/dashboard/referrals/${info.row.original.id}`}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1.5 transition-colors"
              aria-label="View referral details"
              title="View details"
            >
              <Eye className="size-4" />
            </Link>
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
                <div className="bg-muted-foreground/20 h-4 w-32 rounded" />
                <div className="bg-muted-foreground/20 h-3 w-48 rounded" />
              </div>
              <div className="bg-muted-foreground/20 size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="bg-muted-foreground/20 h-4 w-28 rounded" />
                <div className="bg-muted-foreground/20 h-3 w-40 rounded" />
              </div>
              <div className="bg-muted-foreground/20 h-6 w-20 rounded-full" />
              <div className="bg-muted-foreground/20 h-6 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Third child: Empty state */}
      <CardEmptyState
        title="No referrals found"
        description="There are no referrals to display at this time."
      />
    </WrapperLoader>
  );
};

export default TableReferral;
