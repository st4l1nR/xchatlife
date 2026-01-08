"use client";

import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Dropdown, DropdownButton, DropdownMenu } from "../atoms/dropdown";
import { tokenPricing, type TokenPricingItem } from "@/lib/constants";

const indicatorColors = {
  green: "bg-green-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
} as const;

export type PricingItem = TokenPricingItem;

export type DropdownTokenProps = {
  tokenCount: number;
  pricing?: PricingItem[];
  onBuyMore?: () => void;
  onAddTokens?: () => void;
  className?: string;
};

const DropdownToken: React.FC<DropdownTokenProps> = ({
  tokenCount,
  pricing = tokenPricing,
  onBuyMore,
  onAddTokens,
  className,
}) => {
  return (
    <Dropdown>
      <DropdownButton
        as="div"
        className={clsx(
          "bg-muted flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5",
          className,
        )}
      >
        <Image
          src="/images/global/token.svg"
          alt="Token"
          width={16}
          height={16}
          className="size-4"
        />
        <span className="text-foreground text-sm">Tokens</span>
        <span className="text-foreground text-sm font-medium">
          {tokenCount}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddTokens?.();
          }}
          className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full transition-opacity hover:opacity-90"
        >
          <PlusIcon className="size-3" />
        </button>
      </DropdownButton>

      <DropdownMenu anchor="bottom" className="block! w-52 p-4">
        <div className="flex flex-col">
          <div className="space-y-3">
            {pricing.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "size-2.5 rounded-full",
                      indicatorColors[item.color],
                    )}
                  />
                  <span className="text-muted-foreground text-sm">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-foreground text-sm font-semibold">
                    {item.cost}
                  </span>
                  <Image
                    src="/images/global/token.svg"
                    alt="Token"
                    width={14}
                    height={14}
                    className="size-3.5"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-border mt-4 border-t pt-4">
            <button
              type="button"
              onClick={onBuyMore}
              className="bg-primary text-primary-foreground flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            >
              Buy more
              <PlusIcon className="size-4" />
            </button>
          </div>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownToken;
