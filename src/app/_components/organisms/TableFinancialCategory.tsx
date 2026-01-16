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
import { Badge } from "../atoms/badge";
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export type FinancialTypeValue = "income" | "expense";

export type TableFinancialCategoryItem = {
  id: string;
  name: string;
  label: string;
  type: FinancialTypeValue;
  group: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
};

export type TableFinancialCategoryProps = {
  className?: string;
  loading: boolean;
  totalDocs: number;
  data: TableFinancialCategoryItem[];
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
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const GROUP_LABELS: Record<string, string> = {
  affiliates: "Affiliates",
  infrastructure: "Infrastructure",
  ai: "AI Services",
  subscriptions: "Subscriptions",
  tokens: "Tokens",
  other: "Other",
};

const getTypeColor = (type: FinancialTypeValue): "emerald" | "rose" => {
  return type === "income" ? "emerald" : "rose";
};

const getTypeIcon = (type: FinancialTypeValue) => {
  return type === "income" ? (
    <ArrowUpCircle className="size-4" />
  ) : (
    <ArrowDownCircle className="size-4" />
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const TableFinancialCategory: React.FC<TableFinancialCategoryProps> = ({
  className,
  loading,
  totalDocs,
  data,
  pagination,
  sorting,
  columnFilters,
  onSortingChange,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const columnHelper = createColumnHelper<TableFinancialCategoryItem>();

  const columns = [
    // NAME Column - Label + Name (slug)
    columnHelper.accessor("label", {
      header: "Category",
      enableSorting: true,
      cell: (info) => (
        <div className="flex flex-col">
          <span className="text-foreground font-medium">{info.getValue()}</span>
          <span className="text-muted-foreground text-sm">
            {info.row.original.name}
          </span>
        </div>
      ),
    }),

    // TYPE Column - Income/Expense with icon
    columnHelper.accessor("type", {
      header: "Type",
      enableSorting: true,
      cell: (info) => {
        const type = info.getValue();
        return (
          <Badge color={getTypeColor(type)}>
            <span className="flex items-center gap-1">
              {getTypeIcon(type)}
              <span className="capitalize">{type}</span>
            </span>
          </Badge>
        );
      },
    }),

    // GROUP Column
    columnHelper.accessor("group", {
      header: "Group",
      enableSorting: true,
      cell: (info) => (
        <Badge color="zinc">
          {GROUP_LABELS[info.getValue()] || info.getValue()}
        </Badge>
      ),
    }),

    // DESCRIPTION Column
    columnHelper.accessor("description", {
      header: "Description",
      enableSorting: false,
      cell: (info) => (
        <span className="text-muted-foreground text-sm">
          {info.getValue() || "-"}
        </span>
      ),
    }),

    // STATUS Column - Active/Inactive
    columnHelper.accessor("isActive", {
      header: "Status",
      enableSorting: true,
      cell: (info) => (
        <Badge color={info.getValue() ? "emerald" : "zinc"}>
          {info.getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
    }),

    // CREATED AT Column
    columnHelper.accessor("createdAt", {
      header: "Created At",
      enableSorting: true,
      cell: (info) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(info.getValue())}
        </span>
      ),
    }),

    // ACTIONS Column
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit?.(info.row.original.id)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1.5 transition-colors"
            aria-label="Edit category"
            title="Edit"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(info.row.original.id)}
            className="rounded p-1.5 text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/20"
            aria-label="Delete category"
            title="Delete"
          >
            <Trash2 className="size-4" />
          </button>
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
              <div className="flex-1 space-y-2">
                <div className="bg-muted-foreground/20 h-4 w-32 rounded" />
                <div className="bg-muted-foreground/20 h-3 w-24 rounded" />
              </div>
              <div className="bg-muted-foreground/20 h-6 w-20 rounded-full" />
              <div className="bg-muted-foreground/20 h-6 w-24 rounded-full" />
              <div className="bg-muted-foreground/20 h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Third child: Empty state */}
      <CardEmptyState
        title="No categories found"
        description="There are no financial categories to display at this time."
      />
    </WrapperLoader>
  );
};

export default TableFinancialCategory;
