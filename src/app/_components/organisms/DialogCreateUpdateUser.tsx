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
import {
  Listbox,
  ListboxOption,
  ListboxLabel,
} from "@/app/_components/atoms/listbox";
import { api } from "@/trpc/react";

export type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
};

export type ExistingUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  roleName?: string;
};

export type DialogCreateUpdateUserProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "update";
  existingUser?: ExistingUser;
  onSuccess?: () => void;
};

// Zod schema for form validation
const userSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  roleId: z.string().min(1, "Role is required"),
});

type UserSchemaType = z.infer<typeof userSchema>;

const DialogCreateUpdateUser: React.FC<DialogCreateUpdateUserProps> = ({
  className,
  open,
  onClose,
  mode,
  existingUser,
  onSuccess,
}) => {
  const utils = api.useUtils();

  // Fetch available roles
  const { data: rolesData } = api.role.getAll.useQuery();

  // Mutation for inviting a new user
  const inviteUser = api.admin.inviteUser.useMutation({
    onSuccess: (data) => {
      toast.success("Invitation sent successfully!");
      // If no email was configured, show the invite link (dev mode)
      if (data.data.inviteLink) {
        toast.success(`Dev mode - Invite link: ${data.data.inviteLink}`, {
          duration: 10000,
        });
      }
      void utils.admin.getInvitations.invalidate();
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to send invitation");
    },
  });

  // Mutation for updating user role
  const updateUserRole = api.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("User role updated successfully!");
      void utils.admin.getUsers.invalidate();
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update user role");
    },
  });

  const loading = inviteUser.isPending || updateUserRole.isPending;

  // Get default roleId (first role in list or existing user's role)
  const defaultRoleId = useMemo(() => {
    if (existingUser?.roleId) return existingUser.roleId;
    return rolesData?.data?.[0]?.id ?? "";
  }, [existingUser?.roleId, rolesData?.data]);

  const defaultValues = useMemo(
    () => ({
      firstName: existingUser?.firstName ?? "",
      lastName: existingUser?.lastName ?? "",
      email: existingUser?.email ?? "",
      roleId: existingUser?.roleId ?? defaultRoleId,
    }),
    [existingUser, defaultRoleId],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });
  // Reset form when dialog opens or existingUser changes
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const onFormSubmit = (data: UserSchemaType) => {
    if (mode === "create") {
      // Send invitation
      inviteUser.mutate({
        email: data.email,
        roleId: data.roleId,
      });
    } else if (existingUser) {
      // Update user role
      updateUserRole.mutate({
        userId: existingUser.id,
        customRoleId: data.roleId,
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
      size="xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle>
          {mode === "create" ? "Invite New User" : "Edit User"}
        </DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Send an invitation email to add a new user to the system"
            : "Update user information"}
        </DialogDescription>

        <DialogBody className="space-y-6">
          {/* First Name and Last Name - Two Column Layout (optional for invites) */}
          {mode === "create" && (
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label>First Name (Optional)</Label>
                <Input
                  type="text"
                  placeholder="Enter first name"
                  {...register("firstName")}
                  data-invalid={errors.firstName ? true : undefined}
                  disabled={loading}
                />
                {errors.firstName && (
                  <ErrorMessage>{errors.firstName.message}</ErrorMessage>
                )}
              </Field>

              <Field>
                <Label>Last Name (Optional)</Label>
                <Input
                  type="text"
                  placeholder="Enter last name"
                  {...register("lastName")}
                  data-invalid={errors.lastName ? true : undefined}
                  disabled={loading}
                />
                {errors.lastName && (
                  <ErrorMessage>{errors.lastName.message}</ErrorMessage>
                )}
              </Field>
            </div>
          )}

          {/* Email Field */}
          <Field>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email address"
              {...register("email")}
              data-invalid={errors.email ? true : undefined}
              disabled={loading || mode === "update"}
              className={mode === "update" ? "bg-muted cursor-not-allowed" : ""}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
            {mode === "create" && (
              <p className="text-muted-foreground mt-1 text-xs">
                An invitation email will be sent to this address
              </p>
            )}
          </Field>

          {/* Role Field */}
          <Field>
            <Label>Role</Label>
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value}
                  onChange={field.onChange}
                  // disabled={loading}
                  placeholder="Select a role"
                >
                  {rolesData?.data?.map((role) => (
                    <ListboxOption key={role.id} value={role.id}>
                      <ListboxLabel>{role.name}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.roleId && (
              <ErrorMessage>{errors.roleId.message}</ErrorMessage>
            )}
            <p className="text-muted-foreground mt-1 text-xs">
              {mode === "create"
                ? "The user will be assigned this role after accepting the invitation"
                : "Change the user's role in the system"}
            </p>
          </Field>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {mode === "create" ? "Send Invitation" : "Update Role"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogCreateUpdateUser;
