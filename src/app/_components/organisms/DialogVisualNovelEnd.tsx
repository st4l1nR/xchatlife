"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
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
import {
  Listbox,
  ListboxOption,
  ListboxLabel,
} from "@/app/_components/atoms/listbox";
import RichTextEditor from "@/app/_components/molecules/RichTextEditor";
import type {
  VisualNovelNodeData,
  EndingType,
} from "@/app/_contexts/VisualNovelEditorContext";

// ============================================================================
// Types
// ============================================================================

export interface DialogVisualNovelEndProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  nodeData?: VisualNovelNodeData;
  onSubmit?: (data: EndFormData) => void;
  loading?: boolean;
}

export interface EndFormData {
  label: string;
  endingType: EndingType;
  finalMessage?: string;
}

// ============================================================================
// Schema
// ============================================================================

const endSchema = z.object({
  label: z.string().min(1, "Ending name is required"),
  endingType: z.enum(["good", "neutral", "bad", "secret"]),
  finalMessage: z.string().optional(),
});

type EndSchemaType = z.infer<typeof endSchema>;

// ============================================================================
// Constants
// ============================================================================

const ENDING_TYPES: Array<{ value: EndingType; label: string; color: string }> =
  [
    { value: "good", label: "Good Ending", color: "text-green-500" },
    { value: "neutral", label: "Neutral Ending", color: "text-gray-500" },
    { value: "bad", label: "Bad Ending", color: "text-red-500" },
    { value: "secret", label: "Secret Ending", color: "text-purple-500" },
  ];

// ============================================================================
// Component
// ============================================================================

const DialogVisualNovelEnd: React.FC<DialogVisualNovelEndProps> = ({
  className,
  open,
  onClose,
  mode,
  nodeData,
  onSubmit,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EndSchemaType>({
    resolver: zodResolver(endSchema),
    defaultValues: {
      label: nodeData?.label ?? "",
      endingType: nodeData?.endingType ?? "neutral",
      finalMessage: nodeData?.finalMessage ?? "",
    },
  });

  // Reset form when dialog opens or nodeData changes
  useEffect(() => {
    if (open) {
      reset({
        label: nodeData?.label ?? "",
        endingType: nodeData?.endingType ?? "neutral",
        finalMessage: nodeData?.finalMessage ?? "",
      });
    }
  }, [open, nodeData, reset]);

  const onFormSubmit = (data: EndSchemaType) => {
    onSubmit?.(data);
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
        <DialogTitle>
          {mode === "create" ? "Add Ending" : "Edit Ending"}
        </DialogTitle>
        <DialogDescription>Configure the story ending</DialogDescription>

        <DialogBody className="space-y-6">
          {/* Ending Name Field */}
          <Field>
            <Label>Ending Name</Label>
            <Input
              type="text"
              placeholder="e.g., True Love, Bad End, Secret Path"
              {...register("label")}
              data-invalid={errors.label ? true : undefined}
              disabled={loading}
            />
            {errors.label && (
              <ErrorMessage>{errors.label.message}</ErrorMessage>
            )}
          </Field>

          {/* Ending Type Field */}
          <Field>
            <Label>Ending Type</Label>
            <Controller
              name="endingType"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select ending type..."
                  aria-label="Select ending type"
                >
                  {ENDING_TYPES.map((type) => (
                    <ListboxOption key={type.value} value={type.value}>
                      <span className={clsx("mr-2", type.color)}>●</span>
                      <ListboxLabel>{type.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.endingType && (
              <ErrorMessage>{errors.endingType.message}</ErrorMessage>
            )}
          </Field>

          {/* Final Message Field */}
          <div className="space-y-2">
            <label className="text-foreground text-lg/6 font-medium sm:text-base/6">
              Final Message (Optional)
            </label>
            <p className="text-muted-foreground text-sm">
              An epilogue or closing message for this ending
            </p>
            <Controller
              name="finalMessage"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value ?? ""}
                  onUpdate={(content) => field.onChange(content)}
                  placeholder="Enter the final message..."
                  disabled={loading}
                  minHeight="120px"
                />
              )}
            />
          </div>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {mode === "create" ? "Add Ending" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogVisualNovelEnd;
