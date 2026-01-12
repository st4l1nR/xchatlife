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
import { Checkbox, CheckboxField } from "@/app/_components/atoms/checkbox";
import { api } from "@/trpc/react";

// Permission categories mapped from Prisma schema
const PERMISSION_CATEGORIES = [
  { key: "user", label: "User Management" },
  { key: "character", label: "Character Management" },
  { key: "chat", label: "Chat & Messaging" },
  { key: "media", label: "Media Library" },
  { key: "content", label: "Content (Reels/Stories)" },
  { key: "visual_novel", label: "Visual Novels" },
  { key: "ticket", label: "Support Tickets" },
  { key: "subscription", label: "Billing & Subscriptions" },
  { key: "affiliate", label: "Affiliate System" },
  { key: "auth", label: "Authentication" },
] as const;

type PermissionKey = (typeof PERMISSION_CATEGORIES)[number]["key"];

type PermissionValue = {
  read: boolean;
  write: boolean;
  create: boolean;
};

export type RolePermissions = Record<PermissionKey, PermissionValue>;

export type RoleFormData = {
  name: string;
  permissions: RolePermissions;
};

export type ExistingRole = {
  id: string;
  name: string;
  permissions: RolePermissions;
};

export type DialogCreateUpdateRoleProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "update";
  existingRole?: ExistingRole;
  onSuccess?: () => void;
};

// Create default permissions object with all false
const createDefaultPermissions = (): RolePermissions => {
  return PERMISSION_CATEGORIES.reduce((acc, category) => {
    acc[category.key] = { read: false, write: false, create: false };
    return acc;
  }, {} as RolePermissions);
};

// Zod schema for form validation
const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(50, "Role name must be 50 characters or less"),
  permissions: z.record(
    z.object({
      read: z.boolean(),
      write: z.boolean(),
      create: z.boolean(),
    }),
  ),
});

type RoleSchemaType = z.infer<typeof roleSchema>;

const DialogCreateUpdateRole: React.FC<DialogCreateUpdateRoleProps> = ({
  className,
  open,
  onClose,
  mode,
  existingRole,
  onSuccess,
}) => {
  const utils = api.useUtils();

  const createRole = api.role.create.useMutation({
    onSuccess: () => {
      toast.success("Role created successfully!");
      void utils.role.invalidate();
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create role. Please try again.");
    },
  });

  const updateRole = api.role.update.useMutation({
    onSuccess: () => {
      toast.success("Role updated successfully!");
      void utils.role.invalidate();
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update role. Please try again.");
    },
  });

  const loading = createRole.isPending || updateRole.isPending;

  const defaultValues = useMemo(
    () => ({
      name: existingRole?.name ?? "",
      permissions: existingRole?.permissions ?? createDefaultPermissions(),
    }),
    [existingRole],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RoleSchemaType>({
    resolver: zodResolver(roleSchema),
    defaultValues,
  });

  // Reset form when dialog opens or existingRole changes
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const permissions = watch("permissions");

  // Calculate select all state
  const selectAllState = useMemo(() => {
    const allPermissions = Object.values(permissions ?? {}).flatMap((p) => [
      p.read,
      p.write,
      p.create,
    ]);
    const allTrue = allPermissions.every(Boolean);
    const allFalse = allPermissions.every((v) => !v);

    if (allTrue) return { checked: true, indeterminate: false };
    if (allFalse) return { checked: false, indeterminate: false };
    return { checked: true, indeterminate: true };
  }, [permissions]);

  // Handle select all toggle
  const handleSelectAll = (checked: boolean) => {
    PERMISSION_CATEGORIES.forEach((category) => {
      setValue(`permissions.${category.key}`, {
        read: checked,
        write: checked,
        create: checked,
      });
    });
  };

  const onFormSubmit = (data: RoleSchemaType) => {
    const formData = data as RoleFormData;

    if (mode === "create") {
      createRole.mutate(formData);
    } else if (existingRole) {
      updateRole.mutate({
        id: existingRole.id,
        ...formData,
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
          {mode === "create" ? "Add New Role" : "Edit Role"}
        </DialogTitle>
        <DialogDescription>Set role permissions</DialogDescription>

        <DialogBody className="space-y-6">
          {/* Role Name Field */}
          <Field>
            <Label>Role Name</Label>
            <Input
              type="text"
              placeholder="Enter a role name"
              {...register("name")}
              data-invalid={errors.name ? true : undefined}
              disabled={loading}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </Field>

          {/* Role Permissions Section */}
          <div className="space-y-4">
            <h3 className="text-foreground text-base font-semibold">
              Role Permission
            </h3>

            {/* Administrator Access - Select All */}
            <div className="border-border flex items-center justify-between border-b pb-4">
              <span className="text-foreground text-sm font-medium">
                Administrator Access
              </span>
              <CheckboxField className="flex items-center gap-2">
                <Checkbox
                  checked={selectAllState.checked}
                  indeterminate={selectAllState.indeterminate}
                  onChange={handleSelectAll}
                  color="orange"
                  disabled={loading}
                />
                <Label className="text-muted-foreground text-sm font-normal">
                  Select All
                </Label>
              </CheckboxField>
            </div>

            {/* Permission Table */}
            <div className="space-y-3">
              {PERMISSION_CATEGORIES.map((category) => (
                <div
                  key={category.key}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-foreground text-sm">
                    {category.label}
                  </span>
                  <div className="flex items-center gap-6">
                    <Controller
                      name={`permissions.${category.key}.read`}
                      control={control}
                      render={({ field }) => (
                        <CheckboxField className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                            color="orange"
                            disabled={loading}
                          />
                          <Label className="text-muted-foreground text-sm font-normal">
                            Read
                          </Label>
                        </CheckboxField>
                      )}
                    />
                    <Controller
                      name={`permissions.${category.key}.write`}
                      control={control}
                      render={({ field }) => (
                        <CheckboxField className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                            color="orange"
                            disabled={loading}
                          />
                          <Label className="text-muted-foreground text-sm font-normal">
                            Write
                          </Label>
                        </CheckboxField>
                      )}
                    />
                    <Controller
                      name={`permissions.${category.key}.create`}
                      control={control}
                      render={({ field }) => (
                        <CheckboxField className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                            color="orange"
                            disabled={loading}
                          />
                          <Label className="text-muted-foreground text-sm font-normal">
                            Create
                          </Label>
                        </CheckboxField>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogCreateUpdateRole;
