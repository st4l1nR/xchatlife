"use client";

import React from "react";
import clsx from "clsx";
import {
  Calendar,
  UserPlus,
  CheckCircle,
  XCircle,
  User,
  RotateCcw,
} from "lucide-react";
import { Avatar } from "../atoms/avatar";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type TicketCategory =
  | "billing"
  | "technical"
  | "account"
  | "content"
  | "other";

export type HeaderTicketProps = {
  className?: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  userName: string;
  userEmail: string;
  userAvatarSrc?: string | null;
  assignedToName?: string | null;
  onAssign?: () => void;
  onResolve?: () => void;
  onReopen?: () => void;
  onMarkUnresolved?: () => void;
  onClose?: () => void;
  loadingAssign?: boolean;
  loadingResolve?: boolean;
  loadingReopen?: boolean;
  loadingMarkUnresolved?: boolean;
  loadingClose?: boolean;
};

const statusColors: Record<TicketStatus, "zinc" | "blue" | "green" | "red"> = {
  open: "zinc",
  in_progress: "blue",
  resolved: "green",
  closed: "red",
};

const statusLabels: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const priorityColors: Record<
  TicketPriority,
  "zinc" | "lime" | "amber" | "red"
> = {
  low: "zinc",
  normal: "lime",
  high: "amber",
  urgent: "red",
};

const priorityLabels: Record<TicketPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

const categoryColors: Record<
  TicketCategory,
  "amber" | "purple" | "cyan" | "pink" | "zinc"
> = {
  billing: "amber",
  technical: "purple",
  account: "cyan",
  content: "pink",
  other: "zinc",
};

const categoryLabels: Record<TicketCategory, string> = {
  billing: "Billing",
  technical: "Technical",
  account: "Account",
  content: "Content",
  other: "Other",
};

const HeaderTicket: React.FC<HeaderTicketProps> = ({
  className,
  subject,
  status,
  priority,
  category,
  createdAt,
  userName,
  userEmail,
  userAvatarSrc,
  assignedToName,
  onAssign,
  onResolve,
  onReopen,
  onMarkUnresolved,
  onClose,
  loadingAssign = false,
  loadingResolve = false,
  loadingReopen = false,
  loadingMarkUnresolved = false,
  loadingClose = false,
}) => {
  const isClosedOrResolved = status === "closed" || status === "resolved";
  const canResolve = status === "open" || status === "in_progress";
  const canClose = status !== "closed";
  const canReopen = status === "closed";
  const canMarkUnresolved = status === "resolved";

  return (
    <div className={clsx("bg-muted overflow-hidden rounded-2xl", className)}>
      {/* Header content */}
      <div className="p-4 sm:p-6">
        {/* Top row - Badges and actions */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Left side - Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge color={statusColors[status]}>{statusLabels[status]}</Badge>
            <Badge color={priorityColors[priority]}>
              {priorityLabels[priority]}
            </Badge>
            <Badge color={categoryColors[category]}>
              {categoryLabels[category]}
            </Badge>
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {onAssign && !isClosedOrResolved && (
              <Button
                onClick={onAssign}
                loading={loadingAssign}
                outline
                className="flex items-center gap-2"
              >
                <UserPlus className="size-4" />
                {assignedToName ? "Reassign" : "Assign"}
              </Button>
            )}
            {onResolve && canResolve && (
              <Button
                onClick={onResolve}
                loading={loadingResolve}
                color="primary"
                className="flex items-center gap-2"
              >
                <CheckCircle className="size-4" />
                Resolve
              </Button>
            )}
            {onMarkUnresolved && canMarkUnresolved && (
              <Button
                onClick={onMarkUnresolved}
                loading={loadingMarkUnresolved}
                outline
                className="flex items-center gap-2"
              >
                <RotateCcw className="size-4" />
                Mark Unresolved
              </Button>
            )}
            {onReopen && canReopen && (
              <Button
                onClick={onReopen}
                loading={loadingReopen}
                color="primary"
                className="flex items-center gap-2"
              >
                <RotateCcw className="size-4" />
                Reopen
              </Button>
            )}
            {onClose && canClose && (
              <Button
                onClick={onClose}
                loading={loadingClose}
                color="red"
                className="flex items-center gap-2"
              >
                <XCircle className="size-4" />
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Subject */}
        <h1 className="text-foreground mt-4 text-xl font-semibold sm:text-2xl">
          {subject}
        </h1>

        {/* User info and date */}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* Submitter */}
          <div className="flex items-center gap-3">
            <Avatar
              src={userAvatarSrc}
              alt={userName}
              initials={userName.charAt(0).toUpperCase()}
              className="size-10"
            />
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-medium">
                {userName}
              </span>
              <span className="text-muted-foreground text-xs">{userEmail}</span>
            </div>
          </div>

          {/* Separator */}
          <div className="bg-border hidden h-8 w-px sm:block" />

          {/* Created date */}
          <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <Calendar className="size-4" />
            <span>Created {createdAt}</span>
          </div>

          {/* Assigned to */}
          {assignedToName && (
            <>
              <div className="bg-border hidden h-8 w-px sm:block" />
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <User className="size-4" />
                <span>Assigned to {assignedToName}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderTicket;
