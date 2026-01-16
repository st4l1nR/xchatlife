"use client";

import React from "react";
import clsx from "clsx";
import { Button } from "@/app/_components/atoms/button";
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/atoms/alert";

export type DialogResendInviteProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  email?: string;
};

const DialogResendInvite: React.FC<DialogResendInviteProps> = ({
  className,
  open,
  onClose,
  onConfirm,
  loading = false,
  email,
}) => {
  return (
    <Alert className={clsx(className)} open={open} onClose={onClose}>
      <AlertTitle>Resend Invitation</AlertTitle>
      <AlertDescription>
        Are you sure you want to resend the invitation to{" "}
        {email ? <strong>{email}</strong> : "this user"}? A new invitation email
        will be sent.
      </AlertDescription>
      <AlertActions>
        <Button plain onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} loading={loading}>
          Resend
        </Button>
      </AlertActions>
    </Alert>
  );
};

export default DialogResendInvite;
