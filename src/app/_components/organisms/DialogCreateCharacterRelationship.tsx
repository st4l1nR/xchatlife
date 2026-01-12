"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import {
  Dialog,
  DialogBody,
  DialogTitle,
  DialogActions,
} from "../atoms/dialog";
import { Button } from "../atoms/button";
import type { RelationshipOption } from "../pages/CreateCharacterPage";

type DialogCreateCharacterRelationshipProps = {
  open: boolean;
  onClose: () => void;
  value: string | undefined;
  onChange: (value: string) => void;
  options: RelationshipOption[];
  containerRef?: React.RefObject<HTMLElement | null>;
};

// 5-column grid on desktop, 2-column on mobile: show 10 items (2 rows on desktop, 5 rows on mobile) initially
const INITIAL_SHOW_COUNT = 10;

const DialogCreateCharacterRelationship: React.FC<
  DialogCreateCharacterRelationshipProps
> = ({ open, onClose, value, onChange, options, containerRef }) => {
  const [localValue, setLocalValue] = useState(value);
  const [showAll, setShowAll] = useState(false);

  // Sync local state with prop when dialog opens
  React.useEffect(() => {
    if (open) {
      setLocalValue(value);
      setShowAll(false);
    }
  }, [open, value]);

  const handleSave = () => {
    if (localValue) {
      onChange(localValue);
    }
    onClose();
  };

  const handleCancel = () => {
    setLocalValue(value);
    onClose();
  };

  // Prevent closing on backdrop click
  const handleClose = () => {
    // Do nothing - only buttons can close
  };

  const visibleOptions = showAll
    ? options
    : options.slice(0, INITIAL_SHOW_COUNT);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      size="5xl"
      containerRef={containerRef}
    >
      <DialogTitle className="text-center text-xl! sm:text-2xl!">
        Edit Relationship
      </DialogTitle>

      <DialogBody>
        <div className="mx-auto flex max-w-sm flex-wrap justify-center gap-4 sm:max-w-2xl">
          {visibleOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setLocalValue(option.id)}
              className={clsx(
                "relative flex w-[calc(50%-0.5rem)] flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 transition-all sm:w-[calc(20%-0.8rem)]",
                localValue === option.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-muted hover:border-muted-foreground",
              )}
            >
              {localValue === option.id && (
                <div className="bg-primary absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full">
                  <svg
                    className="text-primary-foreground h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {option.imageSrc && (
                <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                  <Image
                    src={option.imageSrc}
                    alt={option.label}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>
              )}
              <span
                className={clsx(
                  "text-center text-sm font-medium",
                  localValue === option.id ? "text-primary" : "text-foreground",
                )}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>

        {options.length > INITIAL_SHOW_COUNT && (
          <div className="mx-auto max-w-sm sm:max-w-2xl">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="bg-muted text-muted-foreground hover:bg-muted/80 mt-4 w-full rounded-xl py-3 text-sm font-medium transition-colors"
            >
              {showAll ? "Show less" : "Show all"}
            </button>
          </div>
        )}
      </DialogBody>

      <DialogActions>
        <Button plain onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogCreateCharacterRelationship;
