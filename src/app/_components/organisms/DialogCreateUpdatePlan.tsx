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
import { Switch, SwitchField } from "@/app/_components/atoms/switch";
import { api } from "@/trpc/react";
import type { BillingCycleValue } from "./TablePlan";

// Default months for each billing cycle
const BILLING_CYCLE_DEFAULTS: Record<BillingCycleValue, number> = {
  monthly: 1,
  quarterly: 3,
  annually: 12,
};

export type PlanFormData = {
  label: string;
  billingCycle: BillingCycleValue;
  months: number;
  price: number;
  tokensGranted: number;
  discount?: number | null;
  isActive: boolean;
};

export type ExistingPlan = {
  id: string;
  label: string;
  billingCycle: BillingCycleValue;
  months: number;
  price: number;
  pricePerMonth: number;
  tokensGranted: number;
  discount: number | null;
  isActive: boolean;
};

export type DialogCreateUpdatePlanProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "update";
  existingPlan?: ExistingPlan;
  onSuccess?: () => void;
};

// Zod schema for form validation
const planSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be 100 characters or less"),
  billingCycle: z.enum(["monthly", "quarterly", "annually"], {
    required_error: "Billing cycle is required",
  }),
  months: z.coerce.number().int().min(1, "Months must be at least 1"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  tokensGranted: z.coerce.number().int().min(0, "Tokens must be 0 or greater"),
  discount: z.coerce
    .number()
    .int()
    .min(0, "Discount must be 0 or greater")
    .max(100, "Discount cannot exceed 100%")
    .optional()
    .nullable()
    .transform((val) => (val === 0 ? null : val)),
  isActive: z.boolean(),
});

type PlanSchemaType = z.infer<typeof planSchema>;

const DialogCreateUpdatePlan: React.FC<DialogCreateUpdatePlanProps> = ({
  className,
  open,
  onClose,
  mode,
  existingPlan,
  onSuccess,
}) => {
  const utils = api.useUtils();

  const createPlan = api.subscription.createPlan.useMutation({
    onSuccess: () => {
      toast.success("Plan created successfully!");
      void utils.subscription.invalidate();
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create plan. Please try again.");
    },
  });

  const updatePlan = api.subscription.updatePlan.useMutation({
    onSuccess: () => {
      toast.success("Plan updated successfully!");
      void utils.subscription.invalidate();
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update plan. Please try again.");
    },
  });

  const loading = createPlan.isPending || updatePlan.isPending;

  const defaultValues = useMemo(
    () => ({
      label: existingPlan?.label ?? "",
      billingCycle:
        existingPlan?.billingCycle ?? ("monthly" as BillingCycleValue),
      months: existingPlan?.months ?? 1,
      price: existingPlan?.price ?? 0,
      tokensGranted: existingPlan?.tokensGranted ?? 0,
      discount: existingPlan?.discount ?? null,
      isActive: existingPlan?.isActive ?? true,
    }),
    [existingPlan],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PlanSchemaType>({
    resolver: zodResolver(planSchema),
    defaultValues,
  });

  // Reset form when dialog opens or existingPlan changes
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const billingCycle = watch("billingCycle");
  const price = watch("price");
  const months = watch("months");
  const isActive = watch("isActive");

  // Auto-suggest months when billing cycle changes (only in create mode)
  useEffect(() => {
    if (mode === "create" && billingCycle) {
      setValue("months", BILLING_CYCLE_DEFAULTS[billingCycle]);
    }
  }, [billingCycle, mode, setValue]);

  // Calculate price per month
  const pricePerMonth = useMemo(() => {
    if (price && months && months > 0) {
      return price / months;
    }
    return 0;
  }, [price, months]);

  const onFormSubmit = (data: PlanSchemaType) => {
    if (mode === "create") {
      createPlan.mutate({
        label: data.label,
        billingCycle: data.billingCycle,
        months: data.months,
        price: data.price,
        tokensGranted: data.tokensGranted,
        discount: data.discount ?? undefined,
        isActive: data.isActive,
      });
    } else if (existingPlan) {
      updatePlan.mutate({
        id: existingPlan.id,
        label: data.label,
        price: data.price,
        tokensGranted: data.tokensGranted,
        discount: data.discount,
        isActive: data.isActive,
      });
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
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
            ? "Create Subscription Plan"
            : "Edit Subscription Plan"}
        </DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Create a new subscription plan. The plan will be synced with the payment provider."
            : "Update the plan details. Changes to label and price will be synced with the payment provider."}
        </DialogDescription>

        <DialogBody className="space-y-6">
          {/* Label Field */}
          <Field>
            <Label>Label</Label>
            <Input
              type="text"
              placeholder="e.g., Premium Monthly"
              {...register("label")}
              data-invalid={errors.label ? true : undefined}
              disabled={loading}
            />
            {errors.label && (
              <ErrorMessage>{errors.label.message}</ErrorMessage>
            )}
          </Field>

          {/* Billing Cycle and Months Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Billing Cycle Field */}
            <Field>
              <Label>Billing Cycle</Label>
              <Select
                {...register("billingCycle")}
                data-invalid={errors.billingCycle ? true : undefined}
                disabled={loading || mode === "update"}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </Select>
              {errors.billingCycle && (
                <ErrorMessage>{errors.billingCycle.message}</ErrorMessage>
              )}
              {mode === "update" && (
                <p className="text-muted-foreground mt-1 text-xs">
                  Cannot change billing cycle on existing plans
                </p>
              )}
            </Field>

            {/* Months Field */}
            <Field>
              <Label>Months</Label>
              <Input
                type="number"
                min={1}
                placeholder="1"
                {...register("months")}
                data-invalid={errors.months ? true : undefined}
                disabled={loading || mode === "update"}
              />
              {errors.months && (
                <ErrorMessage>{errors.months.message}</ErrorMessage>
              )}
              {mode === "update" && (
                <p className="text-muted-foreground mt-1 text-xs">
                  Cannot change months on existing plans
                </p>
              )}
            </Field>
          </div>

          {/* Price and Price Per Month Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price Field */}
            <Field>
              <Label>Price (USD)</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="9.99"
                {...register("price")}
                data-invalid={errors.price ? true : undefined}
                disabled={loading}
              />
              {errors.price && (
                <ErrorMessage>{errors.price.message}</ErrorMessage>
              )}
            </Field>

            {/* Price Per Month Display */}
            <Field>
              <Label>Price Per Month</Label>
              <div className="border-border bg-muted/50 text-muted-foreground flex h-10 items-center rounded-md border px-3">
                {formatCurrency(pricePerMonth)}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Auto-calculated from price and months
              </p>
            </Field>
          </div>

          {/* Tokens and Discount Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tokens Granted Field */}
            <Field>
              <Label>Tokens Granted</Label>
              <Input
                type="number"
                min={0}
                placeholder="1000"
                {...register("tokensGranted")}
                data-invalid={errors.tokensGranted ? true : undefined}
                disabled={loading}
              />
              {errors.tokensGranted && (
                <ErrorMessage>{errors.tokensGranted.message}</ErrorMessage>
              )}
            </Field>

            {/* Discount Field */}
            <Field>
              <Label>Discount (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="0"
                {...register("discount")}
                data-invalid={errors.discount ? true : undefined}
                disabled={loading}
              />
              {errors.discount && (
                <ErrorMessage>{errors.discount.message}</ErrorMessage>
              )}
            </Field>
          </div>

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
                {isActive
                  ? "Active - Plan is visible to users"
                  : "Inactive - Plan is hidden from users"}
              </Label>
            </SwitchField>
          </Field>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {mode === "create" ? "Create Plan" : "Update Plan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogCreateUpdatePlan;
