"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/atoms/dialog";
import { Field, Label, ErrorMessage } from "@/app/_components/atoms/fieldset";
import { Textarea } from "@/app/_components/atoms/textarea";
import { api } from "@/trpc/react";

export type DialogCreateTicketActivityProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  ticketId: string;
  ticketSubject?: string;
  /** Mock mode for Storybook - disables API calls */
  mock?: boolean;
};

const createActivitySchema = z.object({
  content: z
    .string()
    .min(1, "Note content is required")
    .max(2000, "Note must be less than 2000 characters"),
});

type CreateActivitySchemaType = z.infer<typeof createActivitySchema>;

const DialogCreateTicketActivity: React.FC<DialogCreateTicketActivityProps> = ({
  className,
  open,
  onClose,
  onSuccess,
  ticketId,
  ticketSubject,
  mock = false,
}) => {
  const utils = api.useUtils();

  const addActivity = api.ticket.addActivity.useMutation({
    onSuccess: () => {
      toast.success("Note added successfully");
      void utils.ticket.getById.invalidate({ id: ticketId });
      void utils.ticket.getActivities.invalidate({ ticketId });
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to add note");
    },
  });

  const loading = addActivity.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateActivitySchemaType>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      content: "",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      reset({ content: "" });
    }
  }, [open, reset]);

  const onFormSubmit = (data: CreateActivitySchemaType) => {
    if (mock) {
      toast.success("Note added successfully (mock)");
      onSuccess?.();
      onClose();
      return;
    }

    addActivity.mutate({
      ticketId,
      content: data.content,
    });
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      className={clsx("", className)}
      open={open}
      onClose={handleClose}
      size="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Header with icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 rounded-xl p-4">
            <MessageSquarePlus className="text-primary h-10 w-10" />
          </div>
        </div>

        <DialogTitle className="text-center">Add Note</DialogTitle>

        <DialogDescription className="text-center">
          Add an internal note or update to this ticket. This will be visible in
          the activity timeline.
        </DialogDescription>

        <DialogBody className="space-y-4">
          {/* Ticket info card */}
          {ticketSubject && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-foreground line-clamp-2 font-medium">
                {ticketSubject}
              </p>
            </div>
          )}

          {/* Note content */}
          <Field>
            <Label>Note Content</Label>
            <Textarea
              {...register("content")}
              placeholder="Enter your note or update..."
              rows={5}
              disabled={loading}
              invalid={!!errors.content}
            />
            {errors.content && (
              <ErrorMessage>{errors.content.message}</ErrorMessage>
            )}
          </Field>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Note
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogCreateTicketActivity;
