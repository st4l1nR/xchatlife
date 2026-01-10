"use client";

import React from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={clsx(
            "bg-background/95 border-border sticky bottom-0 z-50 border-t px-4 py-4 backdrop-blur-sm",
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BannerSelectCharacter;
