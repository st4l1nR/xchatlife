"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogTitle,
  DialogActions,
} from "../../atoms/dialog";
import { Button } from "../../atoms/button";
import { OCCUPATION_OPTIONS } from "./types";
import type { CharacterFormData } from "./types";

type DialogOccupationProps = {
  open: boolean;
  onClose: () => void;
  value: CharacterFormData["occupation"] | undefined;
  onChange: (value: CharacterFormData["occupation"]) => void;
};

const INITIAL_SHOW_COUNT = 15;

const DialogOccupation: React.FC<DialogOccupationProps> = ({
  open,
  onClose,
  value,
  onChange,
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
    ? OCCUPATION_OPTIONS
    : OCCUPATION_OPTIONS.slice(0, INITIAL_SHOW_COUNT);

  return (
    <Dialog open={open} onClose={handleClose} size="4xl">
      <DialogTitle className="text-center text-xl">Edit Occupation</DialogTitle>

      <DialogBody>
        <div className="flex flex-wrap justify-center gap-3">
          {visibleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLocalValue(option.value)}
              className={clsx(
                "relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
                localValue === option.value
                  ? "bg-foreground text-background ring-2 ring-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80",
              )}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
              {localValue === option.value && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>

        {OCCUPATION_OPTIONS.length > INITIAL_SHOW_COUNT && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="mt-4 w-full rounded-xl bg-muted py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
          >
            {showAll ? "Show less" : "Show all"}
          </button>
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

export default DialogOccupation;
