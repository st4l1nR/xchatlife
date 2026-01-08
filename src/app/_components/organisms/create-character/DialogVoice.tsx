"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Check, Play } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogTitle,
  DialogActions,
} from "../../atoms/dialog";
import { Button } from "../../atoms/button";
import { VOICE_OPTIONS } from "./types";
import type { CharacterFormData } from "./types";

type DialogVoiceProps = {
  open: boolean;
  onClose: () => void;
  value: CharacterFormData["voice"] | undefined;
  onChange: (value: CharacterFormData["voice"]) => void;
};

const DialogVoice: React.FC<DialogVoiceProps> = ({
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

  const handlePlayVoice = (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation();
    // Placeholder for audio playback
    console.log("Playing voice:", voiceId);
  };

  return (
    <Dialog open={open} onClose={handleClose} size="4xl">
      <DialogTitle className="text-center text-xl">Edit Voice</DialogTitle>

      <DialogBody>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-9">
          {VOICE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLocalValue(option.value)}
              className={clsx(
                "group relative flex flex-col items-center gap-2 rounded-xl p-3 transition-all",
                localValue === option.value
                  ? "bg-foreground text-background ring-foreground ring-2"
                  : "bg-muted text-foreground hover:bg-muted/80",
              )}
            >
              {/* Checkmark */}
              {localValue === option.value && (
                <Check className="absolute top-1 right-1 h-4 w-4" />
              )}

              {/* Waveform Icon (placeholder) */}
              <div
                className={clsx(
                  "relative flex h-16 w-16 items-center justify-center rounded-full",
                  localValue === option.value
                    ? "bg-background/20"
                    : "bg-gradient-to-br from-purple-500/30 to-pink-500/30",
                )}
              >
                {/* Waveform SVG placeholder */}
                <svg
                  viewBox="0 0 50 30"
                  className={clsx(
                    "h-8 w-10",
                    localValue === option.value
                      ? "text-background"
                      : "text-purple-400",
                  )}
                >
                  <path
                    d="M5 15 Q 10 5, 15 15 T 25 15 T 35 15 T 45 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 18 Q 10 25, 15 15 T 25 15 T 35 15 T 45 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                </svg>

                {/* Play button overlay */}
                <button
                  type="button"
                  onClick={(e) => handlePlayVoice(e, option.value)}
                  className={clsx(
                    "absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100",
                    localValue === option.value
                      ? "bg-background/30"
                      : "bg-black/30",
                  )}
                >
                  <Play
                    className={clsx(
                      "h-6 w-6",
                      localValue === option.value
                        ? "text-background"
                        : "text-white",
                    )}
                  />
                </button>
              </div>

              {/* Voice Label */}
              <span className="text-sm font-semibold">{option.label}</span>
              <span
                className={clsx(
                  "text-xs",
                  localValue === option.value
                    ? "text-background/70"
                    : "text-muted-foreground",
                )}
              >
                {option.description}
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

export default DialogVoice;
