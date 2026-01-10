import React from "react";
import clsx from "clsx";
import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogBody,
  DialogTitle,
} from "@/app/_components/atoms/dialog";
import { Checkbox, CheckboxField } from "@/app/_components/atoms/checkbox";
import { Label } from "@/app/_components/atoms/fieldset";
import { Text } from "@/app/_components/atoms/text";
import { Phone, X } from "lucide-react";

export type DialogConfirmCallProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pricePerMinute?: string;
  dontShowAgain?: boolean;
  onDontShowAgainChange?: (checked: boolean) => void;
  loading?: boolean;
};

const DialogConfirmCall: React.FC<DialogConfirmCallProps> = ({
  className,
  open,
  onClose,
  onConfirm,
  pricePerMinute = "3 tk/min",
  dontShowAgain = false,
  onDontShowAgainChange,
  loading = false,
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

      <DialogTitle>Confirm Your Call</DialogTitle>

      <DialogBody className="space-y-6">
        <CheckboxField>
          <Checkbox
            checked={dontShowAgain}
            onChange={(checked) => onDontShowAgainChange?.(checked)}
          />
          <Label>Don&apos;t show this message again</Label>
        </CheckboxField>

        <div className="mt-3 space-y-3">
          <Button
            className="w-full"
            color="primary"
            onClick={onConfirm}
            loading={loading}
          >
            <Phone data-slot="icon" className="h-5 w-5" />
            Call Me
          </Button>
          <Text className="text-muted-foreground text-center text-sm">
            {pricePerMinute} (beta price)
          </Text>
        </div>

        <div className="space-y-2">
          <Text className="text-sm font-semibold">Tips:</Text>
          <Text className="text-muted-foreground text-sm">
            The Phone Call feature is in beta. Please speak clearly and loudly.
            Feedback is welcome post-call to help us improve.
          </Text>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default DialogConfirmCall;
