"use client";

import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  Dialog,
  DialogBody,
  DialogTitle,
  DialogActions,
} from "../atoms/dialog";
import { Button } from "../atoms/button";
import type { PersonalityOption } from "../pages/CreateCharacterPage";

type DialogCreateCharacterPersonalityProps = {
  open: boolean;
  onClose: () => void;
  value: string | undefined;
  onChange: (value: string) => void;
  options: PersonalityOption[];
  containerRef?: React.RefObject<HTMLElement | null>;
};

const DialogCreateCharacterPersonality: React.FC<
  DialogCreateCharacterPersonalityProps
> = ({ open, onClose, value, onChange, options, containerRef }) => {
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
    <Dialog
      open={open}
      onClose={handleClose}
      size="5xl"
      containerRef={containerRef}
    >
      <DialogTitle className="text-center text-xl! sm:text-2xl!">
        Edit Personality
      </DialogTitle>

      <DialogBody>
        <div className="mx-auto grid max-w-sm grid-cols-1 gap-3 sm:flex sm:max-w-2xl sm:flex-wrap sm:justify-center">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setLocalValue(option.id)}
              className={clsx(
                "flex w-full items-center gap-2 rounded-xl border py-3 pr-4 pl-3 transition-all sm:w-fit",
                localValue === option.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-muted hover:border-muted-foreground",
              )}
            >
              {option.imageSrc && (
                <div className="relative h-8 w-8 shrink-0">
                  <Image
                    src={option.imageSrc}
                    alt={option.label}
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
              )}
              <span
                className={clsx(
                  "font-medium",
                  localValue === option.id ? "text-primary" : "text-foreground",
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
