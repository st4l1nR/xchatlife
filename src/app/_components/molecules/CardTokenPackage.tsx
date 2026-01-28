"use client";

import React from "react";
import clsx from "clsx";
import Image from "next/image";

export type CardTokenPackageProps = {
  tokens: number;
  price: number;
  bonusPercent?: number | null;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
};

const CardTokenPackage: React.FC<CardTokenPackageProps> = ({
  tokens,
  price,
  bonusPercent,
  isSelected = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "relative flex flex-col items-center rounded-xl border-2 px-4 py-5 transition-all",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border bg-muted hover:border-primary/50",
        className,
      )}
    >
      {/* Bonus badge */}
      {bonusPercent && (
        <span className="bg-primary text-primary-foreground absolute -top-2.5 left-1/2 -translate-x-1/2 rounded px-2 py-0.5 text-[10px] font-bold whitespace-nowrap sm:text-xs">
          +{bonusPercent}% bonus
        </span>
      )}

      {/* Token icon and amount */}
      <div className="mb-1 flex items-center gap-1.5">
        <Image
          src="/images/global/token.svg"
          alt="Token"
          width={24}
          height={24}
          className="size-5 sm:size-6"
          unoptimized
        />
        <span className="text-foreground text-2xl font-bold sm:text-3xl">
          {tokens.toLocaleString()}
        </span>
      </div>

      {/* Price */}
      <span className="text-muted-foreground text-sm sm:text-base">
        ${price.toFixed(2)}
      </span>
    </button>
  );
};

export default CardTokenPackage;
