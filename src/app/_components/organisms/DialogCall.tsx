import React from "react";
import clsx from "clsx";
import Image from "next/image";
import * as Headless from "@headlessui/react";
import { Text } from "@/app/_components/atoms/text";
import { PhoneOff } from "lucide-react";

export type DialogCallProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  onHangUp: () => void;
  characterName: string;
  characterImage: string;
  status?: "ringing" | "connecting" | "connected" | "ended";
  duration?: string;
};

const statusLabels: Record<NonNullable<DialogCallProps["status"]>, string> = {
  ringing: "Ringing...",
  connecting: "Connecting...",
  connected: "Connected",
  ended: "Call Ended",
};

const DialogCall: React.FC<DialogCallProps> = ({
  className,
  open,
  onClose,
  onHangUp,
  characterName,
  characterImage,
  status = "ringing",
  duration,
}) => {
  return (
    <Headless.Dialog open={open} onClose={onClose}>
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 z-50 bg-black/80 transition duration-100 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 overflow-hidden">
        <Headless.DialogPanel
          transition
          className={clsx(
            "relative flex h-full w-full flex-col items-center justify-between overflow-hidden",
            "transition duration-100 will-change-transform data-closed:scale-95 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in",
            className,
          )}
        >
          {/* Background Image */}
          <Image
            src={characterImage}
            alt={characterName}
            fill
            className="object-cover"
            priority
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />

          {/* Content */}
          <div className="relative z-10 flex w-full flex-col items-center pt-16">
            <Text className="text-3xl font-bold text-white drop-shadow-lg">
              {characterName}
            </Text>
            <Text className="mt-2 text-white/80 drop-shadow-md">
              {status === "connected" && duration
                ? duration
                : statusLabels[status]}
            </Text>
          </div>

          {/* Hang Up Button */}
          <div className="relative z-10 pb-16">
            <button
              onClick={onHangUp}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-red-600 active:scale-95"
              aria-label="Hang up call"
            >
              <PhoneOff className="h-7 w-7" />
            </button>
          </div>
        </Headless.DialogPanel>
      </div>
    </Headless.Dialog>
  );
};

export default DialogCall;
