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
import { Switch } from "../atoms/switch";
import { Pencil, Calendar, Coins, DollarSign } from "lucide-react";

export type BillingCycleValue = "monthly" | "quarterly" | "annually";

export type TablePlanItem = {
  id: string;
  nowpaymentsId: number;
  label: string;
  billingCycle: BillingCycleValue;
  months: number;
  price: number;
  pricePerMonth: number;
  tokensGranted: number;
  discount: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TablePlanProps = {
  className?: string;
  loading: boolean;
  totalDocs: number;
  data: TablePlanItem[];
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
  onToggleActive?: (id: string, isActive: boolean) => void;
  togglingId?: string;
};

const BILLING_CYCLE_LABELS: Record<BillingCycleValue, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annually: "Annually",
};

const BILLING_CYCLE_COLORS: Record<
  BillingCycleValue,
  "blue" | "purple" | "emerald"
> = {
  monthly: "blue",
  quarterly: "purple",
  annually: "emerald",
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const TablePlan: React.FC<TablePlanProps> = ({
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
  onToggleActive,
  togglingId,
}) => {
  const columnHelper = createColumnHelper<TablePlanItem>();

  const columns = [
    // LABEL Column
    columnHelper.accessor("label", {
      header: "Label",
      enableSorting: true,
      cell: (info) => (
        <div className="flex flex-col">
          <span className="text-foreground font-medium">{info.getValue()}</span>
          <span className="text-muted-foreground text-xs">
            ID: {info.row.original.nowpaymentsId}
          </span>
        </div>
      ),
    }),

    // BILLING CYCLE Column
    columnHelper.accessor("billingCycle", {
      header: "Billing Cycle",
      enableSorting: true,
      cell: (info) => {
        const cycle = info.getValue();
        return (
          <Badge color={BILLING_CYCLE_COLORS[cycle]}>
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {BILLING_CYCLE_LABELS[cycle]}
            </span>
          </Badge>
        );
      },
    }),

    // PRICE Column - Shows price and price/month
    columnHelper.accessor("price", {
      header: "Price",
      enableSorting: true,
      cell: (info) => (
        <div className="flex flex-col">
          <span className="text-foreground font-medium">
            {formatCurrency(info.getValue())}
          </span>
          <span className="text-muted-foreground text-xs">
            {formatCurrency(info.row.original.pricePerMonth)}/mo
          </span>
        </div>
      ),
    }),

    // MONTHS Column
    columnHelper.accessor("months", {
      header: "Months",
      enableSorting: true,
      cell: (info) => (
        <span className="text-foreground">
          {info.getValue()} {info.getValue() === 1 ? "month" : "months"}
        </span>
      ),
    }),

    // TOKENS Column
    columnHelper.accessor("tokensGranted", {
      header: "Tokens",
      enableSorting: true,
      cell: (info) => (
        <Badge color="amber">
          <span className="flex items-center gap-1">
            <Coins className="size-3" />
            {info.getValue().toLocaleString()}
          </span>
        </Badge>
      ),
    }),

    // DISCOUNT Column
    columnHelper.accessor("discount", {
      header: "Discount",
      enableSorting: true,
      cell: (info) => {
        const discount = info.getValue();
        return discount ? (
          <Badge color="rose">
            <span className="flex items-center gap-1">
              <DollarSign className="size-3" />
              {discount}% off
            </span>
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    }),

    // STATUS Column with Toggle
    columnHelper.accessor("isActive", {
      header: "Status",
      enableSorting: true,
      cell: (info) => {
        const isActive = info.getValue();
        const isToggling = togglingId === info.row.original.id;
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onChange={(checked) =>
                onToggleActive?.(info.row.original.id, checked)
              }
              color="emerald"
              disabled={isToggling}
            />
            <Badge color={isActive ? "emerald" : "zinc"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
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
            aria-label="Edit plan"
            title="Edit"
          >
            <Pencil className="size-4" />
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
              <div className="bg-muted-foreground/20 h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Third child: Empty state */}
      <CardEmptyState
        title="No plans found"
        description="There are no subscription plans to display. Create your first plan to get started."
      />
    </WrapperLoader>
  );
};

export default TablePlan;
