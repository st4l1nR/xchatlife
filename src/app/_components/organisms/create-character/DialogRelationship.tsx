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
import { RELATIONSHIP_OPTIONS } from "./types";
import type { CharacterFormData } from "./types";

type DialogRelationshipProps = {
  open: boolean;
  onClose: () => void;
  value: CharacterFormData["relationship"] | undefined;
  onChange: (value: CharacterFormData["relationship"]) => void;
};

const INITIAL_SHOW_COUNT = 10;

const DialogRelationship: React.FC<DialogRelationshipProps> = ({
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
    ? RELATIONSHIP_OPTIONS
    : RELATIONSHIP_OPTIONS.slice(0, INITIAL_SHOW_COUNT);

  return (
    <Dialog open={open} onClose={handleClose} size="4xl">
      <DialogTitle className="text-center text-xl">
        Edit Relationship
      </DialogTitle>

      <DialogBody>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {visibleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLocalValue(option.value)}
              className={clsx(
                "relative flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-sm font-medium transition-all",
                localValue === option.value
                  ? "bg-foreground text-background ring-foreground ring-2"
                  : "bg-muted text-foreground hover:bg-muted/80",
              )}
            >
              <span className="text-3xl">{option.emoji}</span>
              <span className="text-center">{option.label}</span>
              {localValue === option.value && (
                <Check className="absolute top-1 right-1 h-4 w-4" />
              )}
            </button>
          ))}
        </div>

        {RELATIONSHIP_OPTIONS.length > INITIAL_SHOW_COUNT && (
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

export default DialogRelationship;
