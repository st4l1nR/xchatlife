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
import type { CharacterFormData } from "../pages/CreateCharacterPage";

type DialogCreateCharacterRelationshipProps = {
  open: boolean;
  onClose: () => void;
  value: CharacterFormData["relationship"] | undefined;
  onChange: (value: CharacterFormData["relationship"]) => void;
  options: readonly { value: string; label: string; emoji: string }[];
  containerRef?: React.RefObject<HTMLElement | null>;
};

// 5-column grid on desktop, 2-column on mobile: show 10 items (2 rows on desktop, 5 rows on mobile) initially
const INITIAL_SHOW_COUNT = 10;

// Map relationship values to image filenames (using underscore values to match Prisma enum)
const getRelationshipImagePath = (value: string): string => {
  const labelMap: Record<string, string> = {
    stranger: "Stranger",
    girlfriend: "Girlfriend",
    sex_friend: "Sex Friend",
    school_mate: "School Mate",
    work_colleague: "Work Colleague",
    wife: "Wife",
    mistress: "Mistress",
    friend: "Friend",
    step_sister: "Step Sister",
    step_mom: "Step Mom",
  };
  const filename = labelMap[value] ?? value;
  return `/images/create-character/girls/realistic/step-5/relationship/${filename}.png`;
};

const DialogCreateCharacterRelationship: React.FC<DialogCreateCharacterRelationshipProps> = ({
  open,
  onClose,
  value,
  onChange,
  options,
  containerRef,
}) => {
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
      onChange(localValue as CharacterFormData["relationship"]);
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
    <Dialog open={open} onClose={handleClose} size="5xl" containerRef={containerRef}>
      <DialogTitle className="text-center text-xl! sm:text-2xl!">Edit Relationship</DialogTitle>

      <DialogBody>
        <div className="mx-auto grid max-w-sm grid-cols-2 gap-4 sm:max-w-2xl sm:grid-cols-5">
          {visibleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLocalValue(option.value as CharacterFormData["relationship"])}
              className={clsx(
                "relative flex flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 transition-all",
                localValue === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border bg-muted hover:border-muted-foreground",
              )}
            >
              {localValue === option.value && (
                <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                <Image
                  src={getRelationshipImagePath(option.value)}
                  alt={option.label}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
              <span className={clsx(
                  "text-center text-sm font-medium",
                  localValue === option.value ? "text-primary" : "text-foreground"
                )}>{option.label}</span>
            </button>
          ))}
        </div>

        {options.length > INITIAL_SHOW_COUNT && (
          <div className="mx-auto max-w-sm sm:max-w-2xl">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="mt-4 w-full rounded-xl bg-muted py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
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
