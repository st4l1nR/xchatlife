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
import RichTextEditor from "@/app/_components/molecules/RichTextEditor";
import type { VisualNovelNodeData } from "@/app/_contexts/VisualNovelEditorContext";

// ============================================================================
// Types
// ============================================================================

export interface DialogVisualNovelBranchProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  nodeData?: VisualNovelNodeData;
  onSubmit?: (data: BranchFormData) => void;
  loading?: boolean;
}

export interface BranchFormData {
  label: string;
  context?: string;
}

// ============================================================================
// Schema
// ============================================================================

const branchSchema = z.object({
  label: z.string().min(1, "Choice text is required"),
  context: z.string().optional(),
});

type BranchSchemaType = z.infer<typeof branchSchema>;

// ============================================================================
// Component
// ============================================================================

const DialogVisualNovelBranch: React.FC<DialogVisualNovelBranchProps> = ({
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
  } = useForm<BranchSchemaType>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      label: nodeData?.label ?? "",
      context: "",
    },
  });

  // Reset form when dialog opens or nodeData changes
  useEffect(() => {
    if (open) {
      reset({
        label: nodeData?.label ?? "",
        context: "",
      });
    }
  }, [open, nodeData, reset]);

  const onFormSubmit = (data: BranchSchemaType) => {
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
          {mode === "create" ? "Add Choice" : "Edit Choice"}
        </DialogTitle>
        <DialogDescription>
          Configure the player choice/decision point
        </DialogDescription>

        <DialogBody className="space-y-6">
          {/* Choice Text Field */}
          <Field>
            <Label>Choice Text</Label>
            <Input
              type="text"
              placeholder="e.g., Go left, Talk to her, Stay silent"
              {...register("label")}
              data-invalid={errors.label ? true : undefined}
              disabled={loading}
            />
            {errors.label && (
              <ErrorMessage>{errors.label.message}</ErrorMessage>
            )}
          </Field>

          {/* Context Field */}
          <div className="space-y-2">
            <label className="text-foreground text-lg/6 font-medium sm:text-base/6">
              Context (Optional)
            </label>
            <p className="text-muted-foreground text-sm">
              When should this choice appear? Any conditions?
            </p>
            <Controller
              name="context"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value ?? ""}
                  onUpdate={(content) => field.onChange(content)}
                  placeholder="Describe when this choice is available..."
                  disabled={loading}
                  minHeight="100px"
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
            {mode === "create" ? "Add Choice" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogVisualNovelBranch;
