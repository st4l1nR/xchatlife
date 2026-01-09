"use client";

import React, { useState, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogTitle,
  DialogActions,
} from "../atoms/dialog";
import { Button } from "../atoms/button";
import type { CharacterFormData } from "../pages/CreateCharacterPage";

type DialogCreateCharacterVoiceProps = {
  open: boolean;
  onClose: () => void;
  value: CharacterFormData["voice"] | undefined;
  onChange: (value: CharacterFormData["voice"]) => void;
  options: readonly { value: string; label: string; description: string }[];
  containerRef?: React.RefObject<HTMLElement | null>;
};

const VOICE_IMAGE_PATH =
  "/images/create-character/girls/realistic/step-5/voice/waveform-0a113678139bf59ba2eb1a743cf0f23b485eb2849d710171778b8225b0c7701e.png";
const VOICE_VIDEO_PATH =
  "/images/create-character/girls/realistic/step-5/voice/waveform-62d9d48b2ebc188830c3ffdaa8952afb53fa4c7a340cf0a05f063efe591c86f7.webm";

const DialogCreateCharacterVoice: React.FC<DialogCreateCharacterVoiceProps> = ({
  open,
  onClose,
  value,
  onChange,
  options,
  containerRef,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync local state with prop when dialog opens
  React.useEffect(() => {
    if (open) {
      setLocalValue(value);
      setPlayingVoice(null);
    }
  }, [open, value]);

  // Stop video when dialog closes
  React.useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setPlayingVoice(null);
    }
  }, [open]);

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

  const handleTogglePlay = (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation();
    e.preventDefault();

    if (playingVoice === voiceId) {
      // Pause and reset to beginning
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setPlayingVoice(null);
    } else {
      // Start playing this voice
      setPlayingVoice(voiceId);
    }
  };

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    setPlayingVoice(null);
  };

  const handleSelectVoice = (voiceId: string) => {
    // Stop any playing video when selecting a different item
    if (playingVoice && playingVoice !== voiceId) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setPlayingVoice(null);
    }
    setLocalValue(voiceId as CharacterFormData["voice"]);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      size="5xl"
      containerRef={containerRef}
    >
      <DialogTitle className="text-center text-xl! sm:text-2xl!">
        Edit Voice
      </DialogTitle>

      <DialogBody>
        <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-4 sm:max-w-2xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelectVoice(option.value)}
              className={clsx(
                "group relative flex w-[calc(25%-12px)] flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 transition-all sm:w-[calc(20%-13px)]",
                localValue === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border bg-muted hover:border-muted-foreground",
              )}
            >
              {/* Checkmark */}
              {localValue === option.value && (
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

              {/* Voice Image/Video Container */}
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full sm:h-16 sm:w-16">
                {playingVoice === option.value ? (
                  <video
                    ref={videoRef}
                    src={VOICE_VIDEO_PATH}
                    autoPlay
                    onEnded={handleVideoEnded}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={VOICE_IMAGE_PATH}
                    alt={option.label}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}

                {/* Play/Pause button overlay - only interactive when visible on hover */}
                <button
                  type="button"
                  onClick={(e) => handleTogglePlay(e, option.value)}
                  className={clsx(
                    "absolute inset-0 flex items-center justify-center rounded-full bg-black/30 transition-opacity",
                    playingVoice === option.value
                      ? "opacity-100"
                      : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
                  )}
                >
                  {playingVoice === option.value ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>

              {/* Voice Label */}
              <span
                className={clsx(
                  "text-center text-sm font-medium",
                  localValue === option.value
                    ? "text-primary"
                    : "text-foreground",
                )}
              >
                {option.label}
              </span>
              <span className="text-muted-foreground text-center text-xs">
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

export default DialogCreateCharacterVoice;
