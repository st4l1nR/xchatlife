"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import clsx from "clsx";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import TableTicket from "../organisms/TableTicket";
import DialogAssignTicket from "../organisms/DialogAssignTicket";
import type { TicketInfo } from "../organisms/DialogAssignTicket";
import { Input, InputGroup } from "../atoms/input";
import { Listbox, ListboxOption, ListboxLabel } from "../atoms/listbox";
import { Button } from "../atoms/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../atoms/dialog";
import { api } from "@/trpc/react";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  TableTicketItem,
  TicketStatusType,
  TicketPriorityType,
  TicketCategoryType,
} from "../organisms/TableTicket";

// Filter options
const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
] as const;

const PRIORITY_FILTER_OPTIONS = [
  { value: "", label: "All Priorities" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
] as const;

const CATEGORY_FILTER_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "billing", label: "Billing" },
  { value: "technical", label: "Technical" },
  { value: "account", label: "Account" },
  { value: "content", label: "Content" },
  { value: "other", label: "Other" },
] as const;

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
] as const;

export type DashboardTicketsPageMockData = {
  tickets: TableTicketItem[];
  pagination: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
};

export type DashboardTicketsPageProps = {
  className?: string;
  mock?: DashboardTicketsPageMockData;
};

function DashboardTicketsPageContent({
  className,
  mock,
}: DashboardTicketsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL params
  const statusParam = searchParams.get("status") ?? "";
  const priorityParam = searchParams.get("priority") ?? "";
  const categoryParam = searchParams.get("category") ?? "";
  const assignedToParam = searchParams.get("assignedTo") ?? "";
  const searchParam = searchParams.get("search") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const sizeParam = searchParams.get("size") ?? "10";

  // Local search state for debounce
  const [searchInputValue, setSearchInputValue] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInputValue, 400);

  // Sync debounced search to URL
  React.useEffect(() => {
    if (debouncedSearch !== searchParam) {
      updateParams({ search: debouncedSearch, page: "1" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Sync URL search param to local state when it changes externally
  React.useEffect(() => {
    setSearchInputValue(searchParam);
  }, [searchParam]);

  // Dialog state
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [isReopenDialogOpen, setIsReopenDialogOpen] = useState(false);
  const [isMarkUnresolvedDialogOpen, setIsMarkUnresolvedDialogOpen] =
    useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [assignTicketInfo, setAssignTicketInfo] = useState<TicketInfo | null>(
    null,
  );

  // Update URL params helper
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // Filter handlers
  const handleStatusChange = useCallback(
    (value: string) => {
      updateParams({ status: value, page: "1" });
    },
    [updateParams],
  );

  const handlePriorityChange = useCallback(
    (value: string) => {
      updateParams({ priority: value, page: "1" });
    },
    [updateParams],
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      updateParams({ category: value, page: "1" });
    },
    [updateParams],
  );

  const handleAssignedToChange = useCallback(
    (value: string) => {
      updateParams({ assignedTo: value, page: "1" });
    },
    [updateParams],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(e.target.value);
    },
    [],
  );

  const handlePageSizeChange = useCallback(
    (value: string) => {
      updateParams({ size: value, page: "1" });
    },
    [updateParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateParams({ page: page.toString() });
    },
    [updateParams],
  );

  // Fetch assignable users for filter dropdown
  const { data: assignableUsersData } = api.ticket.getAssignableUsers.useQuery(
    {},
    { enabled: !mock },
  );

  // Build assignee filter options dynamically
  const assigneeFilterOptions = useMemo(() => {
    const baseOptions = [
      { value: "", label: "All Assignees" },
      { value: "unassigned", label: "Unassigned" },
    ];

    if (assignableUsersData?.data) {
      const userOptions = assignableUsersData.data.map((user) => ({
        value: user.id,
        label: `${user.name}${user.roleName ? ` (${user.roleName})` : ""}`,
      }));
      return [...baseOptions, ...userOptions];
    }

    return baseOptions;
  }, [assignableUsersData]);

  // Fetch tickets (disabled when using mock data)
  const { data: ticketsData, isLoading } = api.ticket.getAll.useQuery(
    {
      page: pageParam,
      limit: parseInt(sizeParam, 10),
      search: searchParam || undefined,
      status: (statusParam as TicketStatusType) || undefined,
      priority: (priorityParam as TicketPriorityType) || undefined,
      category: (categoryParam as TicketCategoryType) || undefined,
      assignedToId:
        assignedToParam === "unassigned" ? null : assignedToParam || undefined,
    },
    {
      enabled: !mock,
    },
  );

  const utils = api.useUtils();

  // Resolve ticket mutation
  const resolveTicket = api.ticket.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Ticket resolved successfully");
      void utils.ticket.getAll.invalidate();
      setIsResolveDialogOpen(false);
      setSelectedTicketId(null);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to resolve ticket");
    },
  });

  // Close ticket mutation
  const closeTicket = api.ticket.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Ticket closed successfully");
      void utils.ticket.getAll.invalidate();
      setIsCloseDialogOpen(false);
      setSelectedTicketId(null);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to close ticket");
    },
  });

  // Reopen ticket mutation
  const reopenTicket = api.ticket.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Ticket reopened successfully");
      void utils.ticket.getAll.invalidate();
      setIsReopenDialogOpen(false);
      setSelectedTicketId(null);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to reopen ticket");
    },
  });

  // Mark unresolved mutation
  const markUnresolved = api.ticket.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Ticket marked as unresolved");
      void utils.ticket.getAll.invalidate();
      setIsMarkUnresolvedDialogOpen(false);
      setSelectedTicketId(null);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to mark ticket as unresolved");
    },
  });

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      // Apply client-side filtering for mock data
      let filtered = mock.tickets;

      if (statusParam) {
        filtered = filtered.filter((t) => t.status === statusParam);
      }
      if (priorityParam) {
        filtered = filtered.filter((t) => t.priority === priorityParam);
      }
      if (categoryParam) {
        filtered = filtered.filter((t) => t.category === categoryParam);
      }
      if (assignedToParam) {
        if (assignedToParam === "unassigned") {
          filtered = filtered.filter((t) => !t.assignedToId);
        } else {
          filtered = filtered.filter((t) => t.assignedToId === assignedToParam);
        }
      }
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.subject.toLowerCase().includes(searchLower) ||
            t.userName.toLowerCase().includes(searchLower) ||
            t.userEmail.toLowerCase().includes(searchLower),
        );
      }

      // Apply pagination
      const pageSize = parseInt(sizeParam, 10);
      const startIndex = (pageParam - 1) * pageSize;
      const paginatedTickets = filtered.slice(
        startIndex,
        startIndex + pageSize,
      );

      return {
        tickets: paginatedTickets,
        totalDocs: filtered.length,
        pagination: {
          page: pageParam,
          total: filtered.length,
          totalPage: Math.ceil(filtered.length / pageSize),
          size: pageSize,
        },
      };
    }

    // Transform API data to match TableTicketItem type
    const tickets: TableTicketItem[] =
      ticketsData?.data?.tickets.map((ticket) => ({
        id: ticket.id,
        subject: ticket.subject,
        userName: ticket.user.name,
        userEmail: ticket.user.email,
        userAvatarSrc: ticket.user.image,
        assignedToId: ticket.assignedTo?.id ?? null,
        assignedToName: ticket.assignedTo?.name ?? null,
        assignedToAvatarSrc: ticket.assignedTo?.image ?? null,
        status: ticket.status as TicketStatusType,
        priority: ticket.priority as TicketPriorityType,
        category: ticket.category as TicketCategoryType,
        createdAt: ticket.createdAt.toString(),
      })) ?? [];

    return {
      tickets,
      totalDocs: ticketsData?.data?.totalCount ?? 0,
      pagination: ticketsData?.data
        ? {
            page: ticketsData.data.page,
            total: ticketsData.data.totalCount,
            totalPage: ticketsData.data.totalPages,
            size: parseInt(sizeParam, 10),
          }
        : undefined,
    };
  }, [
    mock,
    ticketsData,
    statusParam,
    priorityParam,
    categoryParam,
    assignedToParam,
    searchParam,
    pageParam,
    sizeParam,
  ]);

  // Action handlers
  const handleAssign = useCallback(
    (id: string) => {
      // Find the ticket info from the processed data
      const ticket = processedData.tickets.find((t) => t.id === id);
      if (ticket) {
        setAssignTicketInfo({
          id: ticket.id,
          subject: ticket.subject,
          userName: ticket.userName,
          currentAssigneeId: ticket.assignedToId,
          currentAssigneeName: ticket.assignedToName,
        });
        setIsAssignDialogOpen(true);
      }
    },
    [processedData.tickets],
  );

  const handleResolve = useCallback((id: string) => {
    setSelectedTicketId(id);
    setIsResolveDialogOpen(true);
  }, []);

  const handleClose = useCallback((id: string) => {
    setSelectedTicketId(id);
    setIsCloseDialogOpen(true);
  }, []);

  const handleReopen = useCallback((id: string) => {
    setSelectedTicketId(id);
    setIsReopenDialogOpen(true);
  }, []);

  const handleMarkUnresolved = useCallback((id: string) => {
    setSelectedTicketId(id);
    setIsMarkUnresolvedDialogOpen(true);
  }, []);

  const handleAssignDialogClose = useCallback(() => {
    setIsAssignDialogOpen(false);
    setAssignTicketInfo(null);
  }, []);

  const handleAssignSuccess = useCallback(() => {
    void utils.ticket.getAll.invalidate();
  }, [utils.ticket.getAll]);

  const handleConfirmResolve = useCallback(() => {
    if (selectedTicketId) {
      resolveTicket.mutate({
        ticketId: selectedTicketId,
        status: "resolved",
      });
    }
  }, [selectedTicketId, resolveTicket]);

  const handleConfirmClose = useCallback(() => {
    if (selectedTicketId) {
      closeTicket.mutate({
        ticketId: selectedTicketId,
        status: "closed",
      });
    }
  }, [selectedTicketId, closeTicket]);

  const handleConfirmReopen = useCallback(() => {
    if (selectedTicketId) {
      reopenTicket.mutate({
        ticketId: selectedTicketId,
        status: "in_progress",
      });
    }
  }, [selectedTicketId, reopenTicket]);

  const handleConfirmMarkUnresolved = useCallback(() => {
    if (selectedTicketId) {
      markUnresolved.mutate({
        ticketId: selectedTicketId,
        status: "in_progress",
      });
    }
  }, [selectedTicketId, markUnresolved]);

  const selectedTicket = useMemo(() => {
    if (mock) {
      return mock.tickets.find((t) => t.id === selectedTicketId);
    }
    return processedData.tickets.find((t) => t.id === selectedTicketId);
  }, [mock, selectedTicketId, processedData.tickets]);

  return (
    <div className={clsx("space-y-6 p-5", className)}>
      {/* Filters Card */}
      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Filters</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Status Filter */}
          <Listbox value={statusParam} onChange={handleStatusChange}>
            {STATUS_FILTER_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Priority Filter */}
          <Listbox value={priorityParam} onChange={handlePriorityChange}>
            {PRIORITY_FILTER_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Category Filter */}
          <Listbox value={categoryParam} onChange={handleCategoryChange}>
            {CATEGORY_FILTER_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Assigned To Filter */}
          <Listbox value={assignedToParam} onChange={handleAssignedToChange}>
            {assigneeFilterOptions.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <Listbox
            value={sizeParam}
            onChange={handlePageSizeChange}
            className="w-20"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>
        </div>

        {/* Search Input */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <InputGroup>
            <Search data-slot="icon" className="text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tickets..."
              value={searchInputValue}
              onChange={handleSearchChange}
              className="w-full max-w-xs"
            />
          </InputGroup>
        </div>
      </div>

      {/* Table */}
      <TableTicket
        loading={isLoading && !mock}
        totalDocs={processedData.totalDocs}
        data={processedData.tickets}
        pagination={processedData.pagination}
        onPageChange={handlePageChange}
        onAssign={handleAssign}
        onResolve={handleResolve}
        onClose={handleClose}
        onReopen={handleReopen}
        onMarkUnresolved={handleMarkUnresolved}
      />

      {/* Assign Dialog */}
      <DialogAssignTicket
        open={isAssignDialogOpen}
        onClose={handleAssignDialogClose}
        onSuccess={handleAssignSuccess}
        ticket={assignTicketInfo}
      />

      {/* Resolve Dialog */}
      <Dialog
        open={isResolveDialogOpen}
        onClose={() => {
          if (!resolveTicket.isPending) {
            setIsResolveDialogOpen(false);
            setSelectedTicketId(null);
          }
        }}
        size="md"
      >
        <DialogTitle>Resolve Ticket</DialogTitle>
        <DialogDescription>
          Are you sure you want to mark this ticket as resolved? The user will
          be notified.
        </DialogDescription>
        <DialogBody>
          {selectedTicket && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-foreground font-medium">
                {selectedTicket.subject}
              </p>
              <p className="text-muted-foreground text-sm">
                From: {selectedTicket.userName}
              </p>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setIsResolveDialogOpen(false);
              setSelectedTicketId(null);
            }}
            disabled={resolveTicket.isPending}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleConfirmResolve}
            loading={resolveTicket.isPending}
          >
            Resolve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Close Dialog */}
      <Dialog
        open={isCloseDialogOpen}
        onClose={() => {
          if (!closeTicket.isPending) {
            setIsCloseDialogOpen(false);
            setSelectedTicketId(null);
          }
        }}
        size="md"
      >
        <DialogTitle>Close Ticket</DialogTitle>
        <DialogDescription>
          Are you sure you want to close this ticket? This action cannot be
          undone.
        </DialogDescription>
        <DialogBody>
          {selectedTicket && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-foreground font-medium">
                {selectedTicket.subject}
              </p>
              <p className="text-muted-foreground text-sm">
                From: {selectedTicket.userName}
              </p>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setIsCloseDialogOpen(false);
              setSelectedTicketId(null);
            }}
            disabled={closeTicket.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleConfirmClose}
            loading={closeTicket.isPending}
          >
            Close Ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reopen Dialog */}
      <Dialog
        open={isReopenDialogOpen}
        onClose={() => {
          if (!reopenTicket.isPending) {
            setIsReopenDialogOpen(false);
            setSelectedTicketId(null);
          }
        }}
        size="md"
      >
        <DialogTitle>Reopen Ticket</DialogTitle>
        <DialogDescription>
          Are you sure you want to reopen this ticket? It will be set to
          &quot;In Progress&quot; status.
        </DialogDescription>
        <DialogBody>
          {selectedTicket && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-foreground font-medium">
                {selectedTicket.subject}
              </p>
              <p className="text-muted-foreground text-sm">
                From: {selectedTicket.userName}
              </p>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setIsReopenDialogOpen(false);
              setSelectedTicketId(null);
            }}
            disabled={reopenTicket.isPending}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleConfirmReopen}
            loading={reopenTicket.isPending}
          >
            Reopen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mark Unresolved Dialog */}
      <Dialog
        open={isMarkUnresolvedDialogOpen}
        onClose={() => {
          if (!markUnresolved.isPending) {
            setIsMarkUnresolvedDialogOpen(false);
            setSelectedTicketId(null);
          }
        }}
        size="md"
      >
        <DialogTitle>Mark as Unresolved</DialogTitle>
        <DialogDescription>
          Are you sure you want to mark this ticket as unresolved? It will be
          set to &quot;In Progress&quot; status.
        </DialogDescription>
        <DialogBody>
          {selectedTicket && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-foreground font-medium">
                {selectedTicket.subject}
              </p>
              <p className="text-muted-foreground text-sm">
                From: {selectedTicket.userName}
              </p>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setIsMarkUnresolvedDialogOpen(false);
              setSelectedTicketId(null);
            }}
            disabled={markUnresolved.isPending}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleConfirmMarkUnresolved}
            loading={markUnresolved.isPending}
          >
            Mark Unresolved
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const DashboardTicketsPage: React.FC<DashboardTicketsPageProps> = (props) => {
  return (
    <Suspense fallback={<div className="animate-pulse p-5">Loading...</div>}>
      <DashboardTicketsPageContent {...props} />
    </Suspense>
  );
};

export default DashboardTicketsPage;
