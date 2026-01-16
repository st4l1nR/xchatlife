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
import { Badge } from "../atoms/badge";
import {
  Pencil,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  User,
  Building2,
} from "lucide-react";

export type FinancialTypeValue = "income" | "expense";

export type TableFinancialTransactionItem = {
  id: string;
  categoryLabel: string;
  categoryName: string;
  type: FinancialTypeValue;
  amount: string;
  currency: string;
  description: string;
  provider?: string | null;
  unitType?: string | null;
  unitCount?: number | null;
  userName?: string | null;
  affiliateName?: string | null;
  createdAt: string;
};

export type TableFinancialTransactionProps = {
  className?: string;
  loading: boolean;
  totalDocs: number;
  data: TableFinancialTransactionItem[];
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

const formatAmount = (
  amount: string,
  currency: string,
  type: FinancialTypeValue,
): string => {
  const numAmount = parseFloat(amount);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(Math.abs(numAmount));

  return type === "expense" ? `-${formatted}` : `+${formatted}`;
};

const UNIT_TYPE_LABELS: Record<string, string> = {
  message: "Messages",
  image: "Images",
  video: "Videos",
  audio: "Audio",
};

const TableFinancialTransaction: React.FC<TableFinancialTransactionProps> = ({
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
  const columnHelper = createColumnHelper<TableFinancialTransactionItem>();

  const columns = [
    // DESCRIPTION Column - Main description + Category
    columnHelper.accessor("description", {
      header: "Description",
      enableSorting: true,
      cell: (info) => (
        <div className="flex flex-col">
          <span className="text-foreground font-medium">{info.getValue()}</span>
          <span className="text-muted-foreground text-sm">
            {info.row.original.categoryLabel}
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

    // AMOUNT Column - Formatted currency
    columnHelper.accessor("amount", {
      header: "Amount",
      enableSorting: true,
      cell: (info) => {
        const type = info.row.original.type;
        const amount = formatAmount(
          info.getValue(),
          info.row.original.currency,
          type,
        );
        return (
          <span
            className={clsx(
              "font-medium",
              type === "income" ? "text-emerald-500" : "text-rose-500",
            )}
          >
            {amount}
          </span>
        );
      },
    }),

    // PROVIDER Column
    columnHelper.accessor("provider", {
      header: "Provider",
      enableSorting: true,
      cell: (info) => {
        const provider = info.getValue();
        if (!provider) return <span className="text-muted-foreground">-</span>;
        return (
          <Badge color="zinc">
            <span className="flex items-center gap-1">
              <Building2 className="size-3" />
              {provider}
            </span>
          </Badge>
        );
      },
    }),

    // UNITS Column - Unit type + count
    columnHelper.accessor("unitType", {
      header: "Units",
      enableSorting: false,
      cell: (info) => {
        const unitType = info.getValue();
        const unitCount = info.row.original.unitCount;
        if (!unitType || !unitCount) {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <span className="text-muted-foreground text-sm">
            {unitCount.toLocaleString()}{" "}
            {UNIT_TYPE_LABELS[unitType] || unitType}
          </span>
        );
      },
    }),

    // RELATED TO Column - User or Affiliate
    columnHelper.display({
      id: "relatedTo",
      header: "Related To",
      cell: (info) => {
        const { userName, affiliateName } = info.row.original;
        if (userName) {
          return (
            <span className="text-muted-foreground flex items-center gap-1 text-sm">
              <User className="size-3" />
              {userName}
            </span>
          );
        }
        if (affiliateName) {
          return (
            <span className="text-muted-foreground flex items-center gap-1 text-sm">
              <Building2 className="size-3" />
              {affiliateName}
            </span>
          );
        }
        return <span className="text-muted-foreground">-</span>;
      },
    }),

    // DATE Column
    columnHelper.accessor("createdAt", {
      header: "Date",
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
            aria-label="Edit transaction"
            title="Edit"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(info.row.original.id)}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded p-1.5 transition-colors"
            aria-label="Delete transaction"
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
                <div className="bg-muted-foreground/20 h-4 w-48 rounded" />
                <div className="bg-muted-foreground/20 h-3 w-32 rounded" />
              </div>
              <div className="bg-muted-foreground/20 h-6 w-20 rounded-full" />
              <div className="bg-muted-foreground/20 h-6 w-24 rounded" />
              <div className="bg-muted-foreground/20 h-6 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Third child: Empty state */}
      <CardEmptyState
        title="No transactions found"
        description="There are no financial transactions to display at this time."
      />
    </WrapperLoader>
  );
};

export default TableFinancialTransaction;
