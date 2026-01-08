"use client";

import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogTitle,
  DialogActions,
} from "../atoms/dialog";
import { Button } from "../atoms/button";
import type { CharacterFormData } from "../pages/CreateCharacterPage";

type DialogCreateCharacterPersonalityProps = {
  open: boolean;
  onClose: () => void;
  value: CharacterFormData["personality"] | undefined;
  onChange: (value: CharacterFormData["personality"]) => void;
  options: readonly { value: string; label: string; emoji: string }[];
  containerRef?: React.RefObject<HTMLElement | null>;
};

// Map personality values to image filenames
const getPersonalityImagePath = (value: string): string => {
  const labelMap: Record<string, string> = {
    nympho: "Nympho",
    lover: "Lover",
    submissive: "Submissive",
    dominant: "Dominant",
    temptress: "Temptress",
    innocent: "Innocent",
    caregiver: "Caregiver",
    experimenter: "Experimenter",
    mean: "Mean",
    confidant: "Confidant",
    shy: "Shy",
    queen: "Queen",
  };
  const filename = labelMap[value] ?? value;
  return `/images/create-character/girls/realistic/step-5/personality/${filename}.png`;
};

const DialogCreateCharacterPersonality: React.FC<DialogCreateCharacterPersonalityProps> = ({
  open,
  onClose,
  value,
  onChange,
  options,
  containerRef,
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
      onChange(localValue as CharacterFormData["personality"]);
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
    <Dialog open={open} onClose={handleClose} size="5xl" containerRef={containerRef}>
      <DialogTitle className="text-center text-xl! sm:text-2xl!">Edit Personality</DialogTitle>

      <DialogBody>
        <div className="mx-auto grid max-w-sm grid-cols-1 gap-3 sm:flex sm:max-w-2xl sm:flex-wrap sm:justify-center">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLocalValue(option.value as CharacterFormData["personality"])}
              className={clsx(
                "flex w-full items-center gap-2 rounded-xl border py-3 pl-3 pr-4 transition-all sm:w-fit",
                localValue === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border bg-muted hover:border-muted-foreground",
              )}
            >
              <div className="relative h-8 w-8 shrink-0">
                <Image
                  src={getPersonalityImagePath(option.value)}
                  alt={option.label}
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <span
                className={clsx(
                  "font-medium",
                  localValue === option.value
                    ? "text-primary"
                    : "text-foreground",
                )}
              >
                {option.label}
              </span>
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

export default DialogCreateCharacterPersonality;
