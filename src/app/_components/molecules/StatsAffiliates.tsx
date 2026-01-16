"use client";

import React from "react";
import clsx from "clsx";
import millify from "millify";

export type StatsAffiliatesItem = {
  label: string;
  value: string | number;
};

export type StatsAffiliatesProps = {
  className?: string;
  stats: StatsAffiliatesItem[];
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

const StatsAffiliates: React.FC<StatsAffiliatesProps> = ({
  className,
  stats,
}) => {
  return (
    <div className={clsx("grid grid-cols-2 gap-4 md:grid-cols-4", className)}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-muted flex aspect-[2/1] flex-col justify-center rounded-lg p-4"
        >
          <p className="text-muted-foreground text-sm">{stat.label}</p>
          <p className="text-foreground text-2xl font-bold">
            {formatValue(stat.value)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsAffiliates;
