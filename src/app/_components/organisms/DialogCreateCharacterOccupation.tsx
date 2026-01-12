"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogTitle,
  DialogActions,
} from "../atoms/dialog";
import { Button } from "../atoms/button";
import type { OccupationOption } from "../pages/CreateCharacterPage";

type DialogCreateCharacterOccupationProps = {
  open: boolean;
  onClose: () => void;
  value: string | undefined;
  onChange: (value: string) => void;
  options: OccupationOption[];
  containerRef?: React.RefObject<HTMLElement | null>;
};

const INITIAL_SHOW_COUNT = 15;

const DialogCreateCharacterOccupation: React.FC<
  DialogCreateCharacterOccupationProps
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
      size="4xl"
      containerRef={containerRef}
    >
      <DialogTitle className="text-center text-xl! sm:text-2xl!">
        Edit Occupation
      </DialogTitle>

      <DialogBody>
        <div className="flex flex-wrap justify-center gap-3">
          {visibleOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setLocalValue(option.id)}
              className={clsx(
                "relative flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                localValue === option.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted text-foreground hover:border-muted-foreground",
              )}
            >
              {option.emoji && <span>{option.emoji}</span>}
              <span>{option.label}</span>
              {localValue === option.id && (
                <Check className="text-primary h-4 w-4" />
              )}
            </button>
          ))}
        </div>

        {options.length > INITIAL_SHOW_COUNT && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="bg-muted text-muted-foreground hover:bg-muted/80 mt-4 w-full rounded-xl py-3 text-sm font-medium transition-colors"
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

export default DialogCreateCharacterOccupation;
