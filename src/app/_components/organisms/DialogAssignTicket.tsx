"use client";

import React, { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { UserPlus, Search, Users } from "lucide-react";
import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/atoms/dialog";
import { Field, Label, ErrorMessage } from "@/app/_components/atoms/fieldset";
import { Input, InputGroup } from "@/app/_components/atoms/input";
import { Avatar } from "@/app/_components/atoms/avatar";
import { Badge } from "@/app/_components/atoms/badge";
import { api } from "@/trpc/react";

export type AssignableUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  roleName: string | null;
};

export type TicketInfo = {
  id: string;
  subject: string;
  userName: string;
  currentAssigneeId?: string | null;
  currentAssigneeName?: string | null;
};

export type DialogAssignTicketProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  ticket: TicketInfo | null;
  /** Mock users for Storybook */
  mockUsers?: AssignableUser[];
};

const assignTicketSchema = z.object({
  assignedToId: z.string().min(1, "Please select a user to assign"),
});

type AssignTicketSchemaType = z.infer<typeof assignTicketSchema>;

const DialogAssignTicket: React.FC<DialogAssignTicketProps> = ({
  className,
  open,
  onClose,
  onSuccess,
  ticket,
  mockUsers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const isReassign = !!ticket?.currentAssigneeId;

  // Fetch assignable users
  const { data: usersData, isLoading: loadingUsers } =
    api.ticket.getAssignableUsers.useQuery(
      { search: searchQuery || undefined },
      { enabled: open && !mockUsers },
    );

  const assignTicket = api.ticket.assign.useMutation({
    onSuccess: () => {
      toast.success(
        isReassign
          ? "Ticket reassigned successfully"
          : "Ticket assigned successfully",
      );
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to assign ticket");
    },
  });

  const loading = assignTicket.isPending;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AssignTicketSchemaType>({
    resolver: zodResolver(assignTicketSchema),
    defaultValues: {
      assignedToId: "",
    },
  });

  const selectedUserId = watch("assignedToId");

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      reset({ assignedToId: "" });
      setSearchQuery("");
    }
  }, [open, reset]);

  // Get users list (from API or mock)
  const users = useMemo(() => {
    if (mockUsers) {
      // Apply search filter for mock data
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return mockUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query),
        );
      }
      return mockUsers;
    }
    return usersData?.data ?? [];
  }, [mockUsers, usersData, searchQuery]);

  const selectedUser = useMemo(() => {
    return users.find((u) => u.id === selectedUserId);
  }, [users, selectedUserId]);

  const onFormSubmit = (data: AssignTicketSchemaType) => {
    if (!ticket) return;

    assignTicket.mutate({
      ticketId: ticket.id,
      assignedToId: data.assignedToId,
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
      size="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Header with icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 rounded-xl p-4">
            <UserPlus className="text-primary h-10 w-10" />
          </div>
        </div>

        <DialogTitle className="text-center">
          {isReassign ? "Reassign Ticket" : "Assign Ticket"}
        </DialogTitle>

        <DialogDescription className="space-y-2 text-center">
          {isReassign ? (
            <p>
              This ticket is currently assigned to{" "}
              <span className="text-foreground font-medium">
                {ticket?.currentAssigneeName}
              </span>
              . Select a new assignee.
            </p>
          ) : (
            <p>Select a team member to assign this ticket to.</p>
          )}
        </DialogDescription>

        <DialogBody className="space-y-4">
          {/* Ticket info card */}
          {ticket && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-foreground line-clamp-2 font-medium">
                {ticket.subject}
              </p>
              <p className="text-muted-foreground text-sm">
                From: {ticket.userName}
              </p>
            </div>
          )}

          {/* Search input */}
          <Field>
            <Label>Search Team Members</Label>
            <InputGroup>
              <Search data-slot="icon" className="text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
              />
            </InputGroup>
          </Field>

          {/* User selection */}
          <Field>
            <Label>Select Assignee</Label>
            <Controller
              name="assignedToId"
              control={control}
              render={({ field }) => (
                <div className="border-border max-h-60 overflow-y-auto rounded-lg border">
                  {loadingUsers && !mockUsers ? (
                    <div className="space-y-2 p-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-muted animate-pulse rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-muted-foreground/20 h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <div className="bg-muted-foreground/20 h-4 w-32 rounded" />
                              <div className="bg-muted-foreground/20 h-3 w-48 rounded" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : users.length === 0 ? (
                    <div className="p-8 text-center">
                      <Users className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                      <p className="text-muted-foreground text-sm">
                        {searchQuery
                          ? "No team members found matching your search"
                          : "No team members available"}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-border divide-y">
                      {users.map((user) => {
                        const isSelected = field.value === user.id;
                        const isCurrentAssignee =
                          user.id === ticket?.currentAssigneeId;

                        return (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => field.onChange(user.id)}
                            disabled={loading}
                            className={clsx(
                              "flex w-full items-center gap-3 p-3 text-left transition-colors",
                              isSelected
                                ? "bg-primary/10"
                                : "hover:bg-muted/50",
                              loading && "cursor-not-allowed opacity-50",
                            )}
                          >
                            <Avatar
                              src={user.image}
                              initials={user.name.charAt(0).toUpperCase()}
                              alt={user.name}
                              className={clsx(
                                "size-10",
                                isSelected && "ring-primary ring-2",
                              )}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={clsx(
                                    "truncate font-medium",
                                    isSelected
                                      ? "text-primary"
                                      : "text-foreground",
                                  )}
                                >
                                  {user.name}
                                </span>
                                {isCurrentAssignee && (
                                  <Badge color="zinc">Current</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground truncate text-sm">
                                  {user.email}
                                </span>
                                {user.roleName && (
                                  <Badge color="blue" className="text-xs">
                                    {user.roleName}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full">
                                <svg
                                  className="h-3 w-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            />
            {errors.assignedToId && (
              <ErrorMessage>{errors.assignedToId.message}</ErrorMessage>
            )}
          </Field>

          {/* Selected user confirmation */}
          {selectedUser && (
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm">
                <span className="text-muted-foreground">
                  {isReassign ? "Reassigning" : "Assigning"} to:{" "}
                </span>
                <span className="text-foreground font-medium">
                  {selectedUser.name}
                </span>
              </p>
            </div>
          )}
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!selectedUserId}>
            {isReassign ? "Reassign" : "Assign"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogAssignTicket;
