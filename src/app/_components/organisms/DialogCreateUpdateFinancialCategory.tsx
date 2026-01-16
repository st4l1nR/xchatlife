"use client";

import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
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
import { Select } from "@/app/_components/atoms/select";
import { Textarea } from "@/app/_components/atoms/textarea";
import { Switch, SwitchField } from "@/app/_components/atoms/switch";
import { api } from "@/trpc/react";
import type { FinancialTypeValue } from "./TableFinancialCategory";

// Predefined groups for the dropdown
const FINANCIAL_GROUPS = [
  { value: "affiliates", label: "Affiliates" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "ai", label: "AI Services" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "tokens", label: "Tokens" },
  { value: "other", label: "Other" },
] as const;

export type FinancialCategoryFormData = {
  name: string;
  label: string;
  type: FinancialTypeValue;
  group: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
};

export type ExistingFinancialCategory = {
  id: string;
  name: string;
  label: string;
  type: FinancialTypeValue;
  group: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type DialogCreateUpdateFinancialCategoryProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "update";
  existingCategory?: ExistingFinancialCategory;
  onSuccess?: () => void;
};

// Zod schema for form validation
const financialCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .regex(
      /^[a-z0-9_]+$/,
      "Name must be lowercase letters, numbers, and underscores only",
    ),
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be 100 characters or less"),
  type: z.enum(["income", "expense"], {
    required_error: "Type is required",
  }),
  group: z.string().min(1, "Group is required").max(50),
  description: z.string().max(500).optional(),
  sortOrder: z.coerce.number().int().min(0, "Sort order must be 0 or greater"),
  isActive: z.boolean(),
});

type FinancialCategorySchemaType = z.infer<typeof financialCategorySchema>;

const DialogCreateUpdateFinancialCategory: React.FC<
  DialogCreateUpdateFinancialCategoryProps
> = ({ className, open, onClose, mode, existingCategory, onSuccess }) => {
  const utils = api.useUtils();

  const createCategory = api.financialCategory.create.useMutation({
    onSuccess: () => {
      toast.success("Category created successfully!");
      void utils.financialCategory.invalidate();
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to create category. Please try again.",
      );
    },
  });

  const updateCategory = api.financialCategory.update.useMutation({
    onSuccess: () => {
      toast.success("Category updated successfully!");
      void utils.financialCategory.invalidate();
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to update category. Please try again.",
      );
    },
  });

  const loading = createCategory.isPending || updateCategory.isPending;

  const defaultValues = useMemo(
    () => ({
      name: existingCategory?.name ?? "",
      label: existingCategory?.label ?? "",
      type: existingCategory?.type ?? ("expense" as FinancialTypeValue),
      group: existingCategory?.group ?? "other",
      description: existingCategory?.description ?? "",
      sortOrder: existingCategory?.sortOrder ?? 0,
      isActive: existingCategory?.isActive ?? true,
    }),
    [existingCategory],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FinancialCategorySchemaType>({
    resolver: zodResolver(financialCategorySchema),
    defaultValues,
  });

  // Reset form when dialog opens or existingCategory changes
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const isActive = watch("isActive");

  const onFormSubmit = (data: FinancialCategorySchemaType) => {
    if (mode === "create") {
      createCategory.mutate({
        name: data.name,
        label: data.label,
        type: data.type,
        group: data.group,
        description: data.description || undefined,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      });
    } else if (existingCategory) {
      updateCategory.mutate({
        id: existingCategory.id,
        name: data.name,
        label: data.label,
        type: data.type,
        group: data.group,
        description: data.description || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      });
    }
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
          {mode === "create"
            ? "Add New Financial Category"
            : "Edit Financial Category"}
        </DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Create a new category to organize your financial transactions."
            : "Update the category details below."}
        </DialogDescription>

        <DialogBody className="space-y-6">
          {/* Name Field (slug) */}
          <Field>
            <Label>Name (Identifier)</Label>
            <Input
              type="text"
              placeholder="e.g., affiliate_commission"
              {...register("name")}
              data-invalid={errors.name ? true : undefined}
              disabled={loading}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </Field>

          {/* Label Field */}
          <Field>
            <Label>Label (Display Name)</Label>
            <Input
              type="text"
              placeholder="e.g., Affiliate Commission"
              {...register("label")}
              data-invalid={errors.label ? true : undefined}
              disabled={loading}
            />
            {errors.label && (
              <ErrorMessage>{errors.label.message}</ErrorMessage>
            )}
          </Field>

          {/* Type and Group Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Type Field */}
            <Field>
              <Label>Type</Label>
              <Select
                {...register("type")}
                data-invalid={errors.type ? true : undefined}
                disabled={loading}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
              {errors.type && (
                <ErrorMessage>{errors.type.message}</ErrorMessage>
              )}
            </Field>

            {/* Group Field */}
            <Field>
              <Label>Group</Label>
              <Select
                {...register("group")}
                data-invalid={errors.group ? true : undefined}
                disabled={loading}
              >
                {FINANCIAL_GROUPS.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </Select>
              {errors.group && (
                <ErrorMessage>{errors.group.message}</ErrorMessage>
              )}
            </Field>
          </div>

          {/* Description Field */}
          <Field>
            <Label>Description (Optional)</Label>
            <Textarea
              placeholder="Brief description of this category..."
              rows={3}
              {...register("description")}
              data-invalid={errors.description ? true : undefined}
              disabled={loading}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </Field>

          {/* Sort Order and Active Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Sort Order Field */}
            <Field>
              <Label>Sort Order</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                {...register("sortOrder")}
                data-invalid={errors.sortOrder ? true : undefined}
                disabled={loading}
              />
              {errors.sortOrder && (
                <ErrorMessage>{errors.sortOrder.message}</ErrorMessage>
              )}
            </Field>

            {/* Active Status */}
            <Field>
              <Label>Status</Label>
              <SwitchField className="mt-2">
                <Switch
                  checked={isActive}
                  onChange={(checked) => setValue("isActive", checked)}
                  color="emerald"
                  disabled={loading}
                />
                <Label className="text-sm font-normal">
                  {isActive ? "Active" : "Inactive"}
                </Label>
              </SwitchField>
            </Field>
          </div>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {mode === "create" ? "Create Category" : "Update Category"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogCreateUpdateFinancialCategory;
