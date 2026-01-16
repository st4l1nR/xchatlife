"use client";

import React, { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
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
import { Textarea } from "@/app/_components/atoms/textarea";
import {
  Listbox,
  ListboxOption,
  ListboxLabel,
} from "@/app/_components/atoms/listbox";
import { api } from "@/trpc/react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

// Types
type FinancialType = "income" | "expense";
type UnitType = "message" | "image" | "video" | "audio";

type CategoryOption = {
  id: string;
  name: string;
  label: string;
  type: FinancialType;
  group: string;
};

export type ExistingTransaction = {
  id: string;
  categoryId: string;
  amount: string;
  currency: string;
  description: string;
  provider?: string | null;
  unitType?: UnitType | null;
  unitCount?: number | null;
  notes?: string | null;
  periodStart?: string | null;
  periodEnd?: string | null;
};

export type DialogCreateUpdateFinancialTransactionProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "update";
  existingTransaction?: ExistingTransaction;
  onSuccess?: () => void;
};

// Zod schema for form validation
const transactionSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  currency: z.string().length(3, "Currency must be 3 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  provider: z.string().max(100).optional().or(z.literal("")),
  unitType: z.enum(["message", "image", "video", "audio"]).optional(),
  unitCount: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseInt(val)) && parseInt(val) > 0), {
      message: "Unit count must be a positive number",
    }),
  notes: z.string().max(1000).optional().or(z.literal("")),
  periodStart: z.string().optional().or(z.literal("")),
  periodEnd: z.string().optional().or(z.literal("")),
});

type TransactionSchemaType = z.infer<typeof transactionSchema>;

const UNIT_TYPE_OPTIONS: { value: UnitType; label: string }[] = [
  { value: "message", label: "Messages" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "audio", label: "Audio" },
];

const DialogCreateUpdateFinancialTransaction: React.FC<
  DialogCreateUpdateFinancialTransactionProps
> = ({ className, open, onClose, mode, existingTransaction, onSuccess }) => {
  const utils = api.useUtils();

  // Fetch categories for dropdown
  const { data: categoriesData } = api.financialCategory.getAll.useQuery(
    { isActive: true, limit: 100 },
    { enabled: open },
  );

  const categories = categoriesData?.data?.categories ?? [];

  // Group categories by group
  const groupedCategories = useMemo(() => {
    const groups: Record<string, CategoryOption[]> = {};
    categories.forEach((cat) => {
      const group = groups[cat.group] ?? [];
      group.push(cat);
      groups[cat.group] = group;
    });
    return groups;
  }, [categories]);

  const createTransaction = api.financialTransaction.create.useMutation({
    onSuccess: () => {
      toast.success("Transaction created successfully!");
      void utils.financialTransaction.invalidate();
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create transaction.");
    },
  });

  const updateTransaction = api.financialTransaction.update.useMutation({
    onSuccess: () => {
      toast.success("Transaction updated successfully!");
      void utils.financialTransaction.invalidate();
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update transaction.");
    },
  });

  const loading = createTransaction.isPending || updateTransaction.isPending;

  const defaultValues = useMemo(
    () => ({
      categoryId: existingTransaction?.categoryId ?? "",
      amount: existingTransaction?.amount ?? "",
      currency: existingTransaction?.currency ?? "USD",
      description: existingTransaction?.description ?? "",
      provider: existingTransaction?.provider ?? "",
      unitType: existingTransaction?.unitType ?? undefined,
      unitCount: existingTransaction?.unitCount?.toString() ?? "",
      notes: existingTransaction?.notes ?? "",
      periodStart: existingTransaction?.periodStart
        ? existingTransaction.periodStart.split("T")[0]
        : "",
      periodEnd: existingTransaction?.periodEnd
        ? existingTransaction.periodEnd.split("T")[0]
        : "",
    }),
    [existingTransaction],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  // Reset form when dialog opens or existingTransaction changes
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  // Watch categoryId to show category type indicator
  const selectedCategoryId = watch("categoryId");
  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId,
  );

  const onFormSubmit = (data: TransactionSchemaType) => {
    const payload = {
      categoryId: data.categoryId,
      amount: parseFloat(data.amount),
      currency: data.currency,
      description: data.description,
      provider: data.provider || undefined,
      unitType: data.unitType || undefined,
      unitCount: data.unitCount ? parseInt(data.unitCount) : undefined,
      notes: data.notes || undefined,
      periodStart: data.periodStart
        ? new Date(data.periodStart).toISOString()
        : undefined,
      periodEnd: data.periodEnd
        ? new Date(data.periodEnd).toISOString()
        : undefined,
    };

    if (mode === "create") {
      createTransaction.mutate(payload);
    } else if (existingTransaction) {
      updateTransaction.mutate({
        id: existingTransaction.id,
        ...payload,
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
      size="2xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle>
          {mode === "create" ? "Add New Transaction" : "Edit Transaction"}
        </DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Record a new financial transaction"
            : "Update transaction details"}
        </DialogDescription>

        <DialogBody className="space-y-6">
          {/* Category Field */}
          <Field>
            <Label>Category</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a category"
                  disabled={loading}
                >
                  {Object.entries(groupedCategories).map(
                    ([group, groupCats]) => (
                      <React.Fragment key={group}>
                        <div className="text-muted-foreground px-3 py-1.5 text-xs font-semibold uppercase">
                          {group}
                        </div>
                        {groupCats.map((cat) => (
                          <ListboxOption key={cat.id} value={cat.id}>
                            <span className="flex items-center gap-2">
                              {cat.type === "income" ? (
                                <ArrowUpCircle className="size-4 text-emerald-500" />
                              ) : (
                                <ArrowDownCircle className="size-4 text-rose-500" />
                              )}
                              <ListboxLabel>{cat.label}</ListboxLabel>
                            </span>
                          </ListboxOption>
                        ))}
                      </React.Fragment>
                    ),
                  )}
                </Listbox>
              )}
            />
            {errors.categoryId && (
              <ErrorMessage>{errors.categoryId.message}</ErrorMessage>
            )}
            {selectedCategory && (
              <p
                className={clsx(
                  "mt-1 text-sm",
                  selectedCategory.type === "income"
                    ? "text-emerald-500"
                    : "text-rose-500",
                )}
              >
                This is an {selectedCategory.type} category
              </p>
            )}
          </Field>

          {/* Amount and Currency Row */}
          <div className="grid grid-cols-3 gap-4">
            <Field className="col-span-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.0001"
                placeholder="0.00"
                {...register("amount")}
                data-invalid={errors.amount ? true : undefined}
                disabled={loading}
              />
              {errors.amount && (
                <ErrorMessage>{errors.amount.message}</ErrorMessage>
              )}
            </Field>
            <Field>
              <Label>Currency</Label>
              <Input
                type="text"
                maxLength={3}
                placeholder="USD"
                {...register("currency")}
                data-invalid={errors.currency ? true : undefined}
                disabled={loading}
                className="uppercase"
              />
              {errors.currency && (
                <ErrorMessage>{errors.currency.message}</ErrorMessage>
              )}
            </Field>
          </div>

          {/* Description Field */}
          <Field>
            <Label>Description</Label>
            <Input
              type="text"
              placeholder="Enter a description for this transaction"
              {...register("description")}
              data-invalid={errors.description ? true : undefined}
              disabled={loading}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </Field>

          {/* Provider Field */}
          <Field>
            <Label>Provider (optional)</Label>
            <Input
              type="text"
              placeholder="e.g., runpod, vercel, stripe"
              {...register("provider")}
              data-invalid={errors.provider ? true : undefined}
              disabled={loading}
            />
            {errors.provider && (
              <ErrorMessage>{errors.provider.message}</ErrorMessage>
            )}
          </Field>

          {/* Unit Type and Count Row */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Unit Type (optional)</Label>
              <Controller
                name="unitType"
                control={control}
                render={({ field }) => (
                  <Listbox
                    value={field.value ?? ""}
                    onChange={(val) => field.onChange(val || undefined)}
                    placeholder="Select unit type"
                    disabled={loading}
                  >
                    <ListboxOption value="">
                      <ListboxLabel>None</ListboxLabel>
                    </ListboxOption>
                    {UNIT_TYPE_OPTIONS.map((option) => (
                      <ListboxOption key={option.value} value={option.value}>
                        <ListboxLabel>{option.label}</ListboxLabel>
                      </ListboxOption>
                    ))}
                  </Listbox>
                )}
              />
            </Field>
            <Field>
              <Label>Unit Count (optional)</Label>
              <Input
                type="number"
                placeholder="0"
                {...register("unitCount")}
                data-invalid={errors.unitCount ? true : undefined}
                disabled={loading}
              />
              {errors.unitCount && (
                <ErrorMessage>{errors.unitCount.message}</ErrorMessage>
              )}
            </Field>
          </div>

          {/* Period Start and End Row */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Period Start (optional)</Label>
              <Input
                type="date"
                {...register("periodStart")}
                data-invalid={errors.periodStart ? true : undefined}
                disabled={loading}
              />
              {errors.periodStart && (
                <ErrorMessage>{errors.periodStart.message}</ErrorMessage>
              )}
            </Field>
            <Field>
              <Label>Period End (optional)</Label>
              <Input
                type="date"
                {...register("periodEnd")}
                data-invalid={errors.periodEnd ? true : undefined}
                disabled={loading}
              />
              {errors.periodEnd && (
                <ErrorMessage>{errors.periodEnd.message}</ErrorMessage>
              )}
            </Field>
          </div>

          {/* Notes Field */}
          <Field>
            <Label>Notes (optional)</Label>
            <Textarea
              rows={3}
              placeholder="Additional notes about this transaction"
              {...register("notes")}
              data-invalid={errors.notes ? true : undefined}
              disabled={loading}
            />
            {errors.notes && (
              <ErrorMessage>{errors.notes.message}</ErrorMessage>
            )}
          </Field>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {mode === "create" ? "Create Transaction" : "Update Transaction"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogCreateUpdateFinancialTransaction;
