"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// ============================================================================
// Types
// ============================================================================

export interface DialogCreateVisualNovelProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateVisualNovelFormData) => void;
  loading?: boolean;
}

export interface CreateVisualNovelFormData {
  title: string;
  description?: string;
}

// ============================================================================
// Schema
// ============================================================================

const createVisualNovelSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

type CreateVisualNovelSchemaType = z.infer<typeof createVisualNovelSchema>;

// ============================================================================
// Component
// ============================================================================

const DialogCreateVisualNovel: React.FC<DialogCreateVisualNovelProps> = ({
  className,
  open,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVisualNovelSchemaType>({
    resolver: zodResolver(createVisualNovelSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        title: "",
        description: "",
      });
    }
  }, [open, reset]);

  const onFormSubmit = (data: CreateVisualNovelSchemaType) => {
    const formData: CreateVisualNovelFormData = {
      title: data.title,
      description: data.description || undefined,
    };
    onSubmit?.(formData);
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
        <DialogTitle>Create Visual Novel</DialogTitle>
        <DialogDescription>
          Give your visual novel a title and optional description to get started
        </DialogDescription>

        <DialogBody className="space-y-4">
          {/* Title Field */}
          <Field>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="e.g., The Lost Kingdom, Midnight Romance"
              {...register("title")}
              data-invalid={errors.title ? true : undefined}
              disabled={loading}
              autoFocus
            />
            {errors.title && (
              <ErrorMessage>{errors.title.message}</ErrorMessage>
            )}
          </Field>

          {/* Description Field */}
          <Field>
            <Label>Description (Optional)</Label>
            <Textarea
              placeholder="A brief description of your visual novel..."
              rows={3}
              {...register("description")}
              data-invalid={errors.description ? true : undefined}
              disabled={loading}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </Field>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogCreateVisualNovel;
