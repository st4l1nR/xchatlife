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
import { Check, X, Eye, ExternalLink } from "lucide-react";

export type AffiliateStatusType = "pending" | "approved" | "rejected";
export type AffiliateTypeValue =
  | "influencer"
  | "blogger"
  | "youtuber"
  | "social_media"
  | "website_owner"
  | "email_marketing"
  | "other";

export type TableAffiliateItem = {
  id: string;
  name: string;
  email: string;
  avatarSrc?: string | null;
  type: AffiliateTypeValue;
  websiteUrl: string;
  status: AffiliateStatusType;
  createdAt: string;
};

export type TableAffiliateProps = {
  className?: string;
  loading: boolean;
  totalDocs: number;
  data: TableAffiliateItem[];
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
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
};

const TYPE_LABELS: Record<AffiliateTypeValue, string> = {
  influencer: "Influencer",
  blogger: "Blogger",
  youtuber: "YouTuber",
  social_media: "Social Media",
  website_owner: "Website Owner",
  email_marketing: "Email Marketing",
  other: "Other",
};

const getStatusColor = (
  status: AffiliateStatusType,
): "amber" | "green" | "red" => {
  switch (status) {
    case "pending":
      return "amber";
    case "approved":
      return "green";
    case "rejected":
      return "red";
    default:
      return "amber";
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

const truncateUrl = (url: string, maxLength = 30): string => {
  try {
    const urlObj = new URL(url);
    const display = urlObj.hostname + urlObj.pathname;
    if (display.length > maxLength) {
      return display.substring(0, maxLength) + "...";
    }
    return display;
  } catch {
    if (url.length > maxLength) {
      return url.substring(0, maxLength) + "...";
    }
    return url;
  }
};

const TableAffiliate: React.FC<TableAffiliateProps> = ({
  className,
  loading,
  totalDocs,
  data,
  pagination,
  sorting,
  columnFilters,
  onSortingChange,
  onPageChange,
  onApprove,
  onReject,
}) => {
  const columnHelper = createColumnHelper<TableAffiliateItem>();

  const columns = [
    // AFFILIATE Column - Avatar + Name + Email
    columnHelper.accessor("name", {
      header: "Affiliate",
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
              {info.row.original.email}
            </span>
          </div>
        </div>
      ),
    }),

    // TYPE Column - Badge with type label
    columnHelper.accessor("type", {
      header: "Type",
      enableSorting: true,
      cell: (info) => (
        <Badge color="zinc">{TYPE_LABELS[info.getValue()]}</Badge>
      ),
    }),

    // WEBSITE Column - Truncated URL with link
    columnHelper.accessor("websiteUrl", {
      header: "Website",
      enableSorting: false,
      cell: (info) => {
        const url = info.getValue();
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm transition-colors"
          >
            {truncateUrl(url)}
            <ExternalLink className="size-3" />
          </a>
        );
      },
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

    // APPLIED AT Column - Formatted date
    columnHelper.accessor("createdAt", {
      header: "Applied At",
      enableSorting: true,
      cell: (info) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(info.getValue())}
        </span>
      ),
    }),

    // ACTION Column - Approve, Reject, View buttons
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const isPending = info.row.original.status === "pending";

        return (
          <div className="flex items-center justify-end gap-1">
            {isPending && (
              <>
                <button
                  type="button"
                  onClick={() => onApprove?.(info.row.original.id)}
                  className="rounded p-1.5 text-green-600 transition-colors hover:bg-green-100 dark:hover:bg-green-900/30"
                  aria-label="Approve affiliate"
                  title="Approve"
                >
                  <Check className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onReject?.(info.row.original.id)}
                  className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
                  aria-label="Reject affiliate"
                  title="Reject"
                >
                  <X className="size-4" />
                </button>
              </>
            )}
            <Link
              href={`/dashboard/affiliates/${info.row.original.id}`}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1.5 transition-colors"
              aria-label="View affiliate details"
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
              <div className="bg-muted-foreground/20 h-6 w-20 rounded-full" />
              <div className="bg-muted-foreground/20 h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Third child: Empty state */}
      <CardEmptyState
        title="No affiliates found"
        description="There are no affiliate applications to display at this time."
      />
    </WrapperLoader>
  );
};

export default TableAffiliate;
