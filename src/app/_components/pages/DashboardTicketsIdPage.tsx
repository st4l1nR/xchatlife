"use client";

import React, { Suspense, useMemo, useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { LayoutList, Plus } from "lucide-react";
import HeaderTicket from "../organisms/HeaderTicket";
import AsideTicketSummary from "../organisms/AsideTicketSummary";
import ListSnackActivity from "../organisms/ListSnackActivity";
import DialogAssignTicket from "../organisms/DialogAssignTicket";
import DialogCreateTicketActivity from "../organisms/DialogCreateTicketActivity";
import { Button } from "../atoms/button";
import type {
  SnackActivityProps,
  ActivityCategory,
} from "../molecules/SnackActivity";
import type { TicketInfo } from "../organisms/DialogAssignTicket";
import { api } from "@/trpc/react";

export type TicketActivityMock = {
  id: string;
  type: "note" | "status_change" | "priority_change" | "assigned" | "created";
  content?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  userName: string;
  userAvatarSrc?: string;
};

export type DashboardTicketsIdPageMockData = {
  // Ticket info
  id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  category: "billing" | "technical" | "account" | "content" | "other";
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  // User info (submitter)
  userName: string;
  userEmail: string;
  userAvatarSrc?: string;
  // Assigned to
  assignedToName?: string;
  assignedToEmail?: string;
  assignedToAvatarSrc?: string;
  // Activities
  activities: TicketActivityMock[];
};

export type DashboardTicketsIdPageProps = {
  className?: string;
  ticketId?: string;
  mock?: DashboardTicketsIdPageMockData;
};

// Map activity type to activity category
function getActivityCategory(
  type: "note" | "status_change" | "priority_change" | "assigned" | "created",
): ActivityCategory {
  const typeMap: Record<string, ActivityCategory> = {
    note: "support",
    status_change: "account",
    priority_change: "account",
    assigned: "account",
    created: "milestone",
  };
  return typeMap[type] ?? "account";
}

// Format date for display
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Format relative time for activity
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
}

function DashboardTicketsIdPageContent({
  className,
  ticketId,
  mock,
}: DashboardTicketsIdPageProps) {
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

  const utils = api.useUtils();

  // Fetch ticket data (disabled when using mock data)
  const { data, isLoading } = api.ticket.getById.useQuery(
    { id: ticketId! },
    { enabled: !mock && !!ticketId },
  );

  // Mutations
  const updateStatus = api.ticket.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      void utils.ticket.getById.invalidate({ id: ticketId });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update status");
    },
  });

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      const activities: SnackActivityProps[] = mock.activities.map(
        (activity) => ({
          id: activity.id,
          category: getActivityCategory(activity.type),
          title: activity.content ?? getActivityTitle(activity.type),
          timestamp: activity.createdAt,
          media: activity.userName
            ? [
                {
                  type: "avatar" as const,
                  src: activity.userAvatarSrc,
                  label: activity.userName,
                },
              ]
            : undefined,
        }),
      );

      return {
        id: mock.id,
        subject: mock.subject,
        description: mock.description,
        status: mock.status,
        priority: mock.priority,
        category: mock.category,
        createdAt: mock.createdAt,
        updatedAt: mock.updatedAt,
        resolvedAt: mock.resolvedAt,
        userName: mock.userName,
        userEmail: mock.userEmail,
        userAvatarSrc: mock.userAvatarSrc,
        assignedToName: mock.assignedToName,
        assignedToEmail: mock.assignedToEmail,
        assignedToAvatarSrc: mock.assignedToAvatarSrc,
        activities,
        activitiesLoading: false,
      };
    }

    if (!data?.data) {
      return {
        id: ticketId ?? "",
        subject: "",
        description: "",
        status: "open" as const,
        priority: "normal" as const,
        category: "other" as const,
        createdAt: "",
        updatedAt: "",
        resolvedAt: undefined,
        userName: "",
        userEmail: "",
        userAvatarSrc: undefined,
        assignedToName: undefined,
        assignedToEmail: undefined,
        assignedToAvatarSrc: undefined,
        activities: [] as SnackActivityProps[],
        activitiesLoading: isLoading,
      };
    }

    const ticket = data.data;

    // Transform activities
    const transformedActivities: SnackActivityProps[] = (
      ticket.activities ?? []
    ).map((activity) => ({
      id: activity.id,
      category: getActivityCategory(
        activity.type as
          | "note"
          | "status_change"
          | "priority_change"
          | "assigned"
          | "created",
      ),
      title: activity.content ?? getActivityTitle(activity.type),
      timestamp: formatRelativeTime(new Date(activity.createdAt)),
      media: activity.user
        ? [
            {
              type: "avatar" as const,
              src: activity.user.image ?? undefined,
              label: activity.user.name,
            },
          ]
        : undefined,
    }));

    return {
      id: ticket.id,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      createdAt: formatDate(new Date(ticket.createdAt)),
      updatedAt: formatDate(new Date(ticket.updatedAt)),
      resolvedAt: ticket.resolvedAt
        ? formatDate(new Date(ticket.resolvedAt))
        : undefined,
      userName: ticket.user.name,
      userEmail: ticket.user.email,
      userAvatarSrc: ticket.user.image ?? undefined,
      assignedToName: ticket.assignedTo?.name ?? undefined,
      assignedToEmail: ticket.assignedTo?.email ?? undefined,
      assignedToAvatarSrc: ticket.assignedTo?.image ?? undefined,
      activities: transformedActivities,
      activitiesLoading: false,
    };
  }, [mock, data, isLoading, ticketId]);

  // Get activity title from type
  function getActivityTitle(type: string): string {
    const titles: Record<string, string> = {
      note: "Note added",
      status_change: "Status changed",
      priority_change: "Priority changed",
      assigned: "Ticket assigned",
      created: "Ticket created",
    };
    return titles[type] ?? "Activity";
  }

  // Handlers
  const handleResolve = () => {
    if (!ticketId) return;
    updateStatus.mutate({
      ticketId,
      status: "resolved",
    });
  };

  const handleMarkUnresolved = () => {
    if (!ticketId) return;
    updateStatus.mutate({
      ticketId,
      status: "in_progress",
    });
  };

  const handleReopen = () => {
    if (!ticketId) return;
    updateStatus.mutate({
      ticketId,
      status: "in_progress",
    });
  };

  const handleClose = () => {
    if (!ticketId) return;
    updateStatus.mutate({
      ticketId,
      status: "closed",
    });
  };

  const ticketInfo: TicketInfo | null =
    ticketId && processedData.subject
      ? {
          id: ticketId,
          subject: processedData.subject,
          userName: processedData.userName,
          currentAssigneeId: data?.data?.assignedTo?.id ?? null,
          currentAssigneeName: processedData.assignedToName ?? null,
        }
      : null;

  // Loading state
  if (isLoading && !mock) {
    return (
      <div className={clsx("space-y-6", className)}>
        {/* Header skeleton */}
        <div className="bg-muted h-48 animate-pulse rounded-lg" />

        {/* Two-column layout skeleton */}
        <div className="flex gap-6">
          <div className="bg-muted h-96 w-[320px] shrink-0 animate-pulse rounded-lg" />
          <div className="bg-muted h-96 flex-1 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("space-y-6 p-5", className)}>
      {/* Header */}
      <HeaderTicket
        subject={processedData.subject}
        status={processedData.status}
        priority={processedData.priority}
        category={processedData.category}
        createdAt={processedData.createdAt}
        userName={processedData.userName}
        userEmail={processedData.userEmail}
        userAvatarSrc={processedData.userAvatarSrc}
        assignedToName={processedData.assignedToName}
        onAssign={() => setShowAssignDialog(true)}
        onResolve={handleResolve}
        onMarkUnresolved={handleMarkUnresolved}
        onReopen={handleReopen}
        onClose={handleClose}
        loadingResolve={updateStatus.isPending}
        loadingMarkUnresolved={updateStatus.isPending}
        loadingReopen={updateStatus.isPending}
        loadingClose={updateStatus.isPending}
      />

      {/* Two-column layout - 1/3 aside, 2/3 activity */}
      <div className="flex gap-6">
        {/* Left sidebar - fixed width */}
        <div className="w-[320px] shrink-0">
          <AsideTicketSummary
            ticketId={processedData.id}
            status={processedData.status}
            priority={processedData.priority}
            category={processedData.category}
            createdAt={processedData.createdAt}
            updatedAt={processedData.updatedAt}
            resolvedAt={processedData.resolvedAt}
            description={processedData.description}
            userName={processedData.userName}
            userEmail={processedData.userEmail}
            userAvatarSrc={processedData.userAvatarSrc}
            assignedToName={processedData.assignedToName}
            assignedToEmail={processedData.assignedToEmail}
            assignedToAvatarSrc={processedData.assignedToAvatarSrc}
          />
        </div>

        {/* Right content - Activity Timeline card */}
        <div className="bg-muted flex-1 rounded-lg p-6">
          {/* Card header with add note button */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutList className="text-muted-foreground size-5" />
              <h2 className="text-foreground text-lg font-semibold">
                Activity Timeline
              </h2>
            </div>
            <Button
              outline
              onClick={() => setShowAddNoteDialog(true)}
              className="flex items-center gap-1"
            >
              <Plus className="size-4" />
              Add Note
            </Button>
          </div>

          {/* Activity list */}
          <ListSnackActivity
            loading={processedData.activitiesLoading}
            activities={processedData.activities}
            emptyStateTitle="No activity yet"
            emptyStateDescription="Ticket activity will appear here once actions are taken."
          />
        </div>
      </div>

      {/* Dialogs */}
      <DialogAssignTicket
        open={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
        onSuccess={() => {
          void utils.ticket.getById.invalidate({ id: ticketId });
        }}
        ticket={ticketInfo}
      />

      <DialogCreateTicketActivity
        open={showAddNoteDialog}
        onClose={() => setShowAddNoteDialog(false)}
        ticketId={ticketId ?? ""}
        ticketSubject={processedData.subject}
        mock={!!mock}
      />
    </div>
  );
}

const DashboardTicketsIdPage: React.FC<DashboardTicketsIdPageProps> = (
  props,
) => {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="bg-muted h-48 animate-pulse rounded-lg" />
          <div className="flex gap-6">
            <div className="bg-muted h-96 w-[320px] shrink-0 animate-pulse rounded-lg" />
            <div className="bg-muted h-96 flex-1 animate-pulse rounded-lg" />
          </div>
        </div>
      }
    >
      <DashboardTicketsIdPageContent {...props} />
    </Suspense>
  );
};

export default DashboardTicketsIdPage;
