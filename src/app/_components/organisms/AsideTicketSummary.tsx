import React from "react";
import clsx from "clsx";
import {
  Hash,
  Clock,
  AlertCircle,
  Tag,
  Calendar,
  CalendarCheck,
  FileText,
  Mail,
  UserCircle,
} from "lucide-react";
import { Avatar } from "../atoms/avatar";
import { Badge } from "../atoms/badge";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type TicketCategory =
  | "billing"
  | "technical"
  | "account"
  | "content"
  | "other";

export type AsideTicketSummaryProps = {
  className?: string;
  // Ticket Details
  ticketId: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  // Description
  description: string;
  // Submitter
  userName: string;
  userEmail: string;
  userAvatarSrc?: string | null;
  // Assigned To
  assignedToName?: string | null;
  assignedToEmail?: string | null;
  assignedToAvatarSrc?: string | null;
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

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
};

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <li className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground text-sm">{label}:</span>
      <span className="text-foreground ml-auto text-sm">{value}</span>
    </li>
  );
};

const AsideTicketSummary: React.FC<AsideTicketSummaryProps> = ({
  className,
  ticketId,
  status,
  priority,
  category,
  createdAt,
  updatedAt,
  resolvedAt,
  description,
  userName,
  userEmail,
  userAvatarSrc,
  assignedToName,
  assignedToEmail,
  assignedToAvatarSrc,
}) => {
  return (
    <aside className={clsx("", className)}>
      <div className="bg-muted space-y-6 rounded-lg p-4">
        {/* Ticket Details */}
        <section>
          <h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
            Ticket Details
          </h3>
          <ul className="space-y-3">
            <InfoItem
              icon={<Hash className="size-4" />}
              label="ID"
              value={
                <span className="font-mono text-xs">
                  {ticketId.slice(0, 8)}...
                </span>
              }
            />
            <InfoItem
              icon={<Clock className="size-4" />}
              label="Status"
              value={
                <Badge color={statusColors[status]}>
                  {statusLabels[status]}
                </Badge>
              }
            />
            <InfoItem
              icon={<AlertCircle className="size-4" />}
              label="Priority"
              value={
                <Badge color={priorityColors[priority]}>
                  {priorityLabels[priority]}
                </Badge>
              }
            />
            <InfoItem
              icon={<Tag className="size-4" />}
              label="Category"
              value={
                <Badge color={categoryColors[category]}>
                  {categoryLabels[category]}
                </Badge>
              }
            />
            <InfoItem
              icon={<Calendar className="size-4" />}
              label="Created"
              value={createdAt}
            />
            <InfoItem
              icon={<Calendar className="size-4" />}
              label="Updated"
              value={updatedAt}
            />
            {resolvedAt && (
              <InfoItem
                icon={<CalendarCheck className="size-4" />}
                label="Resolved"
                value={resolvedAt}
              />
            )}
          </ul>
        </section>

        {/* Description */}
        <section>
          <h3 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
            <FileText className="size-4" />
            Description
          </h3>
          <p className="text-foreground text-sm whitespace-pre-wrap">
            {description}
          </p>
        </section>

        {/* Submitter */}
        <section>
          <h3 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
            <UserCircle className="size-4" />
            Submitter
          </h3>
          <div className="flex items-center gap-3">
            <Avatar
              src={userAvatarSrc}
              alt={userName}
              initials={userName.charAt(0).toUpperCase()}
              className="size-10"
            />
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">
                {userName}
              </p>
              <p className="text-muted-foreground flex items-center gap-1 truncate text-xs">
                <Mail className="size-3" />
                {userEmail}
              </p>
            </div>
          </div>
        </section>

        {/* Assigned To */}
        <section>
          <h3 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
            <UserCircle className="size-4" />
            Assigned To
          </h3>
          {assignedToName ? (
            <div className="flex items-center gap-3">
              <Avatar
                src={assignedToAvatarSrc}
                alt={assignedToName}
                initials={assignedToName.charAt(0).toUpperCase()}
                className="size-10"
              />
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">
                  {assignedToName}
                </p>
                {assignedToEmail && (
                  <p className="text-muted-foreground flex items-center gap-1 truncate text-xs">
                    <Mail className="size-3" />
                    {assignedToEmail}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">Unassigned</p>
          )}
        </section>
      </div>
    </aside>
  );
};

export default AsideTicketSummary;
