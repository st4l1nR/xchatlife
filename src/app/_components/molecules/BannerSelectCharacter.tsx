"use client";

import React from "react";
import clsx from "clsx";
import { Button } from "../atoms/button";

export type BannerSelectCharacterProps = {
  className?: string;
  isVisible: boolean;
  onSelect: () => void;
};

const BannerSelectCharacter: React.FC<BannerSelectCharacterProps> = ({
  className,
  isVisible,
  onSelect,
}) => {
  return (
    <div
      className={clsx(
        "bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t border-border px-4 py-4 backdrop-blur-sm transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full",
        className,
      )}
    >
      <div className="mx-auto max-w-lg">
        <Button
          color="primary"
          onClick={onSelect}
          className="w-full py-3 text-base font-semibold"
        >
          Select
        </Button>
      </div>
    </div>
  );
};

export default BannerSelectCharacter;
