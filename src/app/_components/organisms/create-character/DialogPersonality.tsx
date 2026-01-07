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
import { PERSONALITY_OPTIONS } from "./types";
import type { CharacterFormData } from "./types";

type DialogPersonalityProps = {
  open: boolean;
  onClose: () => void;
  value: CharacterFormData["personality"] | undefined;
  onChange: (value: CharacterFormData["personality"]) => void;
};

const DialogPersonality: React.FC<DialogPersonalityProps> = ({
  open,
  onClose,
  value,
  onChange,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync local state with prop when dialog opens
  React.useEffect(() => {
    if (open) {
      setLocalValue(value);
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

  return (
    <Dialog open={open} onClose={handleClose} size="4xl">
      <DialogTitle className="text-center text-xl">Edit Personality</DialogTitle>

      <DialogBody>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {PERSONALITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLocalValue(option.value)}
              className={clsx(
                "relative flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                localValue === option.value
                  ? "bg-foreground text-background ring-2 ring-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80",
              )}
            >
              <span className="text-lg">{option.emoji}</span>
              <span>{option.label}</span>
              {localValue === option.value && (
                <Check className="absolute top-1 right-1 h-4 w-4" />
              )}
            </button>
          ))}
        </div>
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

export default DialogPersonality;
