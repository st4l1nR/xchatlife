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
import type {
  VisualNovelNodeData,
  VisualNovelNode,
} from "@/app/_contexts/VisualNovelEditorContext";

// ============================================================================
// Types
// ============================================================================

export interface DialogVisualNovelJumpProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  nodeData?: VisualNovelNodeData;
  availableNodes?: VisualNovelNode[];
  onSubmit?: (data: JumpFormData) => void;
  loading?: boolean;
}

export interface JumpFormData {
  label: string;
  targetNodeId: string;
}

// ============================================================================
// Schema
// ============================================================================

const jumpSchema = z.object({
  label: z.string().min(1, "Jump name is required"),
  targetNodeId: z.string().min(1, "Target scene is required"),
});

type JumpSchemaType = z.infer<typeof jumpSchema>;

// ============================================================================
// Component
// ============================================================================

const DialogVisualNovelJump: React.FC<DialogVisualNovelJumpProps> = ({
  className,
  open,
  onClose,
  mode,
  nodeData,
  availableNodes = [],
  onSubmit,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<JumpSchemaType>({
    resolver: zodResolver(jumpSchema),
    defaultValues: {
      label: nodeData?.label ?? "",
      targetNodeId: nodeData?.targetNodeId ?? "",
    },
  });

  // Reset form when dialog opens or nodeData changes
  useEffect(() => {
    if (open) {
      reset({
        label: nodeData?.label ?? "",
        targetNodeId: nodeData?.targetNodeId ?? "",
      });
    }
  }, [open, nodeData, reset]);

  const onFormSubmit = (data: JumpSchemaType) => {
    onSubmit?.(data);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Filter out jump and end nodes - can only jump to scenes and branches
  const jumpableNodes = availableNodes.filter(
    (node) =>
      node.data.variant === "scene" ||
      node.data.variant === "branch" ||
      node.data.variant === "start",
  );

  return (
    <Dialog
      className={clsx("", className)}
      open={open}
      onClose={handleClose}
      size="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle>
          {mode === "create" ? "Add Jump" : "Edit Jump"}
        </DialogTitle>
        <DialogDescription>
          Jump to another scene in the story
        </DialogDescription>

        <DialogBody className="space-y-6">
          {/* Jump Name Field */}
          <Field>
            <Label>Jump Name</Label>
            <Input
              type="text"
              placeholder="e.g., Return to main path"
              {...register("label")}
              data-invalid={errors.label ? true : undefined}
              disabled={loading}
            />
            {errors.label && (
              <ErrorMessage>{errors.label.message}</ErrorMessage>
            )}
          </Field>

          {/* Target Scene Field */}
          <Field>
            <Label>Target Scene</Label>
            <Controller
              name="targetNodeId"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a scene to jump to..."
                  aria-label="Select target scene"
                >
                  {jumpableNodes.map((node) => (
                    <ListboxOption key={node.id} value={node.id}>
                      <ListboxLabel>
                        {node.data.label ?? node.label ?? node.id}
                        {node.data.variant !== "scene" && (
                          <span className="text-muted-foreground ml-2 text-xs">
                            ({node.data.variant})
                          </span>
                        )}
                      </ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.targetNodeId && (
              <ErrorMessage>{errors.targetNodeId.message}</ErrorMessage>
            )}
          </Field>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {mode === "create" ? "Add Jump" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogVisualNovelJump;
