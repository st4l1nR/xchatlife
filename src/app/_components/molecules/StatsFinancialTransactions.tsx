"use client";

import React from "react";
import clsx from "clsx";
import millify from "millify";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  type LucideIcon,
} from "lucide-react";

export type StatsFinancialTransactionsVariant =
  | "income"
  | "expense"
  | "balance-positive"
  | "balance-negative"
  | "neutral";

export type StatsFinancialTransactionsItem = {
  label: string;
  value: string | number;
  variant?: StatsFinancialTransactionsVariant;
  icon?: LucideIcon;
};

export type StatsFinancialTransactionsProps = {
  className?: string;
  stats: StatsFinancialTransactionsItem[];
};

const formatValue = (value: string | number): string => {
  if (typeof value === "string") {
    return value;
  }
  if (value >= 1000) {
    return millify(value, { precision: 1 });
  }
  return value.toString();
};

const getIconForVariant = (
  variant: StatsFinancialTransactionsVariant,
  customIcon?: LucideIcon,
): LucideIcon => {
  if (customIcon) return customIcon;

  switch (variant) {
    case "income":
      return ArrowUpCircle;
    case "expense":
      return ArrowDownCircle;
    case "balance-positive":
      return TrendingUp;
    case "balance-negative":
      return TrendingDown;
    case "neutral":
    default:
      return DollarSign;
  }
};

const getIconContainerClasses = (
  variant: StatsFinancialTransactionsVariant,
): string => {
  switch (variant) {
    case "income":
    case "balance-positive":
      return "bg-emerald-100 dark:bg-emerald-900/30";
    case "expense":
    case "balance-negative":
      return "bg-rose-100 dark:bg-rose-900/30";
    case "neutral":
    default:
      return "bg-primary/10";
  }
};

const getIconClasses = (variant: StatsFinancialTransactionsVariant): string => {
  switch (variant) {
    case "income":
    case "balance-positive":
      return "text-emerald-600 dark:text-emerald-400";
    case "expense":
    case "balance-negative":
      return "text-rose-600 dark:text-rose-400";
    case "neutral":
    default:
      return "text-primary";
  }
};

const getValueClasses = (
  variant: StatsFinancialTransactionsVariant,
): string => {
  switch (variant) {
    case "balance-positive":
      return "text-emerald-600 dark:text-emerald-400";
    case "balance-negative":
      return "text-rose-600 dark:text-rose-400";
    default:
      return "text-foreground";
  }
};

const StatsFinancialTransactions: React.FC<StatsFinancialTransactionsProps> = ({
  className,
  stats,
}) => {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {stats.map((stat, index) => {
        const variant = stat.variant ?? "neutral";
        const Icon = getIconForVariant(variant, stat.icon);

        return (
          <div key={index} className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "rounded-full p-2",
                  getIconContainerClasses(variant),
                )}
              >
                <Icon className={clsx("size-5", getIconClasses(variant))} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p
                  className={clsx(
                    "text-lg font-semibold",
                    getValueClasses(variant),
                  )}
                >
                  {formatValue(stat.value)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsFinancialTransactions;
