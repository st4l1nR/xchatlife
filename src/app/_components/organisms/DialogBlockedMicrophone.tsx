import React from "react";
import clsx from "clsx";
import Image from "next/image";
import {
  Dialog,
  DialogBody,
  DialogTitle,
} from "@/app/_components/atoms/dialog";
import { Text } from "@/app/_components/atoms/text";
import { X } from "lucide-react";

export type DialogBlockedMicrophoneProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
};

const DialogBlockedMicrophone: React.FC<DialogBlockedMicrophoneProps> = ({
  className,
  open,
  onClose,
}) => {
  return (
    <Dialog
      className={clsx("relative", className)}
      open={open}
      onClose={onClose}
      size="sm"
    >
      <button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground absolute top-4 right-4 transition-colors"
        aria-label="Close dialog"
      >
        <X className="h-5 w-5" />
      </button>

      <DialogBody className="space-y-6">
        <Image
          src="/images/chat/blocked-microphone.webp"
          alt="Browser showing blocked microphone permission"
          width={560}
          height={200}
          className="w-full rounded-lg"
        />

        <DialogTitle className="text-left">
          Candy.ai has been blocked from using your microphone
        </DialogTitle>

        <ol className="text-foreground list-inside list-decimal space-y-2">
          <li className="flex items-start gap-2">
            <span className="shrink-0">1.</span>
            <Text>
              Click the{" "}
              <span className="bg-muted inline-flex items-center rounded px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </span>{" "}
              page info icon in your browser&apos;s address bar
            </Text>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">2.</span>
            <Text>Turn on microphone</Text>
          </li>
        </ol>
      </DialogBody>
    </Dialog>
  );
};

export default DialogBlockedMicrophone;
