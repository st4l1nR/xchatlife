"use client";

import React from "react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
} from "../atoms/alert";
import { Button } from "../atoms/button";

export type DialogDeleteUserProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  userName?: string;
};

const DialogDeleteUser: React.FC<DialogDeleteUserProps> = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  userName,
}) => {
  return (
    <Alert open={open} onClose={onClose}>
      <AlertTitle>Delete User</AlertTitle>
      <AlertDescription>
        Are you sure you want to delete{" "}
        {userName ? <strong>{userName}</strong> : "this user"}? This action
        cannot be undone and all associated data will be permanently removed.
      </AlertDescription>
      <AlertActions>
        <Button plain onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm} loading={loading}>
          Delete
        </Button>
      </AlertActions>
    </Alert>
  );
};

export default DialogDeleteUser;
