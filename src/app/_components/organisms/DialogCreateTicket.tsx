"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { TicketPlus } from "lucide-react";
import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/atoms/dialog";
import { Field, Label, ErrorMessage } from "@/app/_components/atoms/fieldset";
import { Input } from "@/app/_components/atoms/input";
import { Textarea } from "@/app/_components/atoms/textarea";
import {
  Listbox,
  ListboxOption,
  ListboxLabel,
} from "@/app/_components/atoms/listbox";
import { api } from "@/trpc/react";

export type DialogCreateTicketProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const TICKET_CATEGORIES = [
  {
    id: "billing",
    label: "Billing",
    description: "Payment and subscription issues",
  },
  {
    id: "technical",
    label: "Technical",
    description: "Bugs and technical problems",
  },
  {
    id: "account",
    label: "Account",
    description: "Account settings and access",
  },
  { id: "content", label: "Content", description: "Content-related questions" },
  { id: "other", label: "Other", description: "General inquiries" },
] as const;

const TICKET_PRIORITIES = [
  { id: "low", label: "Low", description: "Can wait" },
  { id: "normal", label: "Normal", description: "Standard request" },
  { id: "high", label: "High", description: "Needs attention soon" },
  { id: "urgent", label: "Urgent", description: "Critical issue" },
] as const;

const createTicketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be less than 5000 characters"),
  category: z.enum(["billing", "technical", "account", "content", "other"], {
    required_error: "Please select a category",
  }),
  priority: z.enum(["low", "normal", "high", "urgent"]),
});

type CreateTicketSchemaType = z.infer<typeof createTicketSchema>;

const DialogCreateTicket: React.FC<DialogCreateTicketProps> = ({
  className,
  open,
  onClose,
  onSuccess,
}) => {
  const defaultValues: CreateTicketSchemaType = {
    subject: "",
    description: "",
    category: "other",
    priority: "normal",
  };

  const createTicket = api.ticket.create.useMutation({
    onSuccess: () => {
      toast.success("Ticket created successfully! We'll get back to you soon.");
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error(
        error.message ?? "Failed to create ticket. Please try again.",
      );
    },
  });

  const loading = createTicket.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTicketSchemaType>({
    resolver: zodResolver(createTicketSchema),
    defaultValues,
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset]);

  const onFormSubmit = (data: CreateTicketSchemaType) => {
    createTicket.mutate({
      subject: data.subject,
      description: data.description,
      category: data.category,
      priority: data.priority,
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
      size="2xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Header with icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 rounded-xl p-4">
            <TicketPlus className="text-primary h-10 w-10" />
          </div>
        </div>

        <DialogTitle className="text-center">Create Support Ticket</DialogTitle>

        <DialogDescription className="space-y-2 text-center">
          <p>Need help? We&apos;re here for you!</p>
          <p className="text-muted-foreground text-sm">
            Please describe your issue and we&apos;ll get back to you as soon as
            possible.
          </p>
        </DialogDescription>

        <DialogBody className="space-y-4">
          {/* Subject Field */}
          <Field>
            <Label>Subject</Label>
            <Input
              type="text"
              placeholder="Brief summary of your issue"
              {...register("subject")}
              data-invalid={errors.subject ? true : undefined}
              disabled={loading}
            />
            {errors.subject && (
              <ErrorMessage>{errors.subject.message}</ErrorMessage>
            )}
          </Field>

          {/* Category Dropdown */}
          <Field>
            <Label>Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading}
                  placeholder="Select a category"
                >
                  {TICKET_CATEGORIES.map((category) => (
                    <ListboxOption key={category.id} value={category.id}>
                      <ListboxLabel>{category.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.category && (
              <ErrorMessage>{errors.category.message}</ErrorMessage>
            )}
          </Field>

          {/* Priority Dropdown */}
          <Field>
            <Label>Priority</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading}
                  placeholder="Select priority"
                >
                  {TICKET_PRIORITIES.map((priority) => (
                    <ListboxOption key={priority.id} value={priority.id}>
                      <ListboxLabel>{priority.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.priority && (
              <ErrorMessage>{errors.priority.message}</ErrorMessage>
            )}
          </Field>

          {/* Description Textarea */}
          <Field>
            <Label>Description</Label>
            <Textarea
              rows={5}
              placeholder="Please describe your issue in detail. Include any relevant information that might help us assist you better..."
              {...register("description")}
              data-invalid={errors.description ? true : undefined}
              disabled={loading}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </Field>

          {/* Info note */}
          <div className="bg-muted rounded-lg p-3">
            <p className="text-muted-foreground text-sm">
              Our support team typically responds within 24 hours. For urgent
              issues, please select &quot;Urgent&quot; priority.
            </p>
          </div>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Submit Ticket
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogCreateTicket;
