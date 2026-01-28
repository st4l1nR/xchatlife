"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  Suspense,
  useEffect,
} from "react";
import clsx from "clsx";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Plus } from "lucide-react";
import toast from "react-hot-toast";
import TableVisualNovel from "../organisms/TableVisualNovel";
import DialogDeleteConfirmation from "../organisms/DialogDeleteConfirmation";
import DialogCreateVisualNovel from "../organisms/DialogCreateVisualNovel";
import { Button } from "../atoms/button";
import { Input, InputGroup } from "../atoms/input";
import { Listbox, ListboxOption, ListboxLabel } from "../atoms/listbox";
import { api } from "@/trpc/react";
import type { TableVisualNovelItem } from "../organisms/TableVisualNovel";
import type { CreateVisualNovelFormData } from "../organisms/DialogCreateVisualNovel";

// Filter options
const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
] as const;

const SORT_BY_OPTIONS = [
  { value: "createdAt", label: "Date" },
  { value: "title", label: "Title" },
  { value: "nodesCount", label: "Nodes" },
  { value: "charactersCount", label: "Characters" },
] as const;

const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
] as const;

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
] as const;

export type DashboardVisualNovelsPageMockData = {
  visualNovels: TableVisualNovelItem[];
  pagination: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
};

export type DashboardVisualNovelsPageProps = {
  className?: string;
  mock?: DashboardVisualNovelsPageMockData;
};

function DashboardVisualNovelsPageContent({
  className,
  mock,
}: DashboardVisualNovelsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL params
  const statusParam = searchParams.get("status") ?? "";
  const sortByParam = searchParams.get("sortBy") ?? "createdAt";
  const sortOrderParam = searchParams.get("sortOrder") ?? "desc";
  const searchParam = searchParams.get("search") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const sizeParam = searchParams.get("size") ?? "10";
  const actionParam = searchParams.get("action");

  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Open create dialog if action=create in URL
  useEffect(() => {
    if (actionParam === "create") {
      setCreateDialogOpen(true);
      // Remove the action param from URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("action");
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl);
    }
  }, [actionParam, pathname, router, searchParams]);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visualNovelToDelete, setVisualNovelToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Fetch visual novels (disabled when using mock data)
  const { data: visualNovelsData, isLoading } =
    api.visualNovel.getForDashboard.useQuery(
      {
        page: pageParam,
        limit: parseInt(sizeParam, 10),
        search: searchParam || undefined,
        status: statusParam
          ? (statusParam as "published" | "draft")
          : undefined,
        sortBy: sortByParam as
          | "createdAt"
          | "title"
          | "nodesCount"
          | "charactersCount",
        sortOrder: sortOrderParam as "asc" | "desc",
      },
      {
        enabled: !mock,
      },
    );

  // tRPC utils for refetching
  const utils = api.useUtils();

  // Create mutation
  const createMutation = api.visualNovel.create.useMutation({
    onSuccess: (data) => {
      toast.success("Visual novel created successfully");
      setCreateDialogOpen(false);
      void utils.visualNovel.getForDashboard.invalidate();
      // Redirect to editor
      if (data?.id) {
        router.push(`/dashboard/visual-novel/editor/${data.id}`);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create visual novel");
    },
  });

  // Delete mutation
  const deleteMutation = api.visualNovel.delete.useMutation({
    onSuccess: () => {
      toast.success("Visual novel deleted successfully");
      setDeleteDialogOpen(false);
      setVisualNovelToDelete(null);
      void utils.visualNovel.getForDashboard.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete visual novel");
    },
  });

  // Publish mutation
  const publishMutation = api.visualNovel.publish.useMutation({
    onSuccess: (_, variables) => {
      const action = variables.isPublished ? "published" : "unpublished";
      toast.success(`Visual novel ${action} successfully`);
      void utils.visualNovel.getForDashboard.invalidate();
    },
    onError: (error, variables) => {
      const action = variables.isPublished ? "publish" : "unpublish";
      toast.error(error.message || `Failed to ${action} visual novel`);
    },
  });

  // Duplicate mutation
  const duplicateMutation = api.visualNovel.duplicate.useMutation({
    onSuccess: () => {
      toast.success("Visual novel duplicated successfully");
      void utils.visualNovel.getForDashboard.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to duplicate visual novel");
    },
  });

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

  const handleSortByChange = useCallback(
    (value: string) => {
      updateParams({ sortBy: value, page: "1" });
    },
    [updateParams],
  );

  const handleSortOrderChange = useCallback(
    (value: string) => {
      updateParams({ sortOrder: value, page: "1" });
    },
    [updateParams],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateParams({ search: e.target.value, page: "1" });
    },
    [updateParams],
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

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      // Apply client-side filtering for mock data
      let filtered = mock.visualNovels;

      if (statusParam) {
        filtered = filtered.filter(
          (visualNovel) => visualNovel.status === statusParam,
        );
      }
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        filtered = filtered.filter(
          (visualNovel) =>
            visualNovel.title.toLowerCase().includes(searchLower) ||
            visualNovel.description?.toLowerCase().includes(searchLower),
        );
      }

      // Apply sorting for mock data
      if (sortByParam === "nodesCount") {
        filtered = [...filtered].sort((a, b) =>
          sortOrderParam === "desc"
            ? b.nodesCount - a.nodesCount
            : a.nodesCount - b.nodesCount,
        );
      } else if (sortByParam === "charactersCount") {
        filtered = [...filtered].sort((a, b) =>
          sortOrderParam === "desc"
            ? b.charactersCount - a.charactersCount
            : a.charactersCount - b.charactersCount,
        );
      } else if (sortByParam === "title") {
        filtered = [...filtered].sort((a, b) =>
          sortOrderParam === "desc"
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title),
        );
      }
      // createdAt sorting is handled by default order in mock data

      // Apply pagination
      const pageSize = parseInt(sizeParam, 10);
      const startIndex = (pageParam - 1) * pageSize;
      const paginatedVisualNovels = filtered.slice(
        startIndex,
        startIndex + pageSize,
      );

      return {
        visualNovels: paginatedVisualNovels,
        totalDocs: filtered.length,
        pagination: {
          page: pageParam,
          total: filtered.length,
          totalPage: Math.ceil(filtered.length / pageSize),
          size: pageSize,
        },
      };
    }

    // Transform API data
    const visualNovels =
      visualNovelsData?.data?.visualNovels.map((vn) => ({
        id: vn.id,
        title: vn.title,
        description: vn.description ?? undefined,
        thumbnailSrc: vn.thumbnailSrc ?? undefined,
        status: vn.status as "published" | "draft",
        nodesCount: vn.nodesCount,
        edgesCount: vn.edgesCount,
        charactersCount: vn.charactersCount,
        createdAt: vn.createdAt,
      })) ?? [];

    return {
      visualNovels,
      totalDocs: visualNovelsData?.data?.pagination.total ?? 0,
      pagination: visualNovelsData?.data?.pagination
        ? {
            page: visualNovelsData.data.pagination.page,
            total: visualNovelsData.data.pagination.total,
            totalPage: visualNovelsData.data.pagination.totalPages,
            size: visualNovelsData.data.pagination.limit,
          }
        : undefined,
    };
  }, [
    mock,
    visualNovelsData,
    statusParam,
    searchParam,
    sortByParam,
    sortOrderParam,
    pageParam,
    sizeParam,
  ]);

  // Action handlers
  const handleDelete = useCallback(
    (id: string) => {
      const visualNovel = processedData.visualNovels.find((vn) => vn.id === id);
      if (visualNovel) {
        setVisualNovelToDelete({ id, title: visualNovel.title });
        setDeleteDialogOpen(true);
      }
    },
    [processedData.visualNovels],
  );

  const handleConfirmDelete = useCallback(() => {
    if (visualNovelToDelete) {
      if (mock) {
        // For Storybook/mock mode
        setDeleteDialogOpen(false);
        setVisualNovelToDelete(null);
        toast.success("Visual novel deleted");
        return;
      }
      deleteMutation.mutate({ id: visualNovelToDelete.id });
    }
  }, [visualNovelToDelete, mock, deleteMutation]);

  const handleView = useCallback(
    (id: string) => {
      // View opens the editor in view mode
      router.push(`/dashboard/visual-novel/editor/${id}`);
    },
    [router],
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/dashboard/visual-novel/editor/${id}`);
    },
    [router],
  );

  const handlePublish = useCallback(
    (id: string) => {
      const visualNovel = processedData.visualNovels.find((vn) => vn.id === id);
      if (!visualNovel) return;

      if (mock) {
        // For Storybook/mock mode
        const action =
          visualNovel.status === "published" ? "unpublished" : "published";
        toast.success(`Visual novel ${action}`);
        return;
      }

      const isCurrentlyPublished = visualNovel.status === "published";
      publishMutation.mutate({
        id,
        isPublished: !isCurrentlyPublished,
      });
    },
    [mock, processedData.visualNovels, publishMutation],
  );

  const handleDuplicate = useCallback(
    (id: string) => {
      if (mock) {
        // For Storybook/mock mode
        toast.success("Visual novel duplicated");
        return;
      }
      duplicateMutation.mutate({ id });
    },
    [mock, duplicateMutation],
  );

  // Handle create visual novel
  const handleCreateSubmit = useCallback(
    (data: CreateVisualNovelFormData) => {
      if (mock) {
        // For Storybook/mock mode, just close the dialog
        setCreateDialogOpen(false);
        toast.success(`Created: ${data.title}`);
        return;
      }
      createMutation.mutate({
        title: data.title,
        description: data.description,
      });
    },
    [mock, createMutation],
  );

  return (
    <div className={clsx("space-y-6 p-5", className)}>
      {/* Filters Card */}
      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Filters</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Status Filter */}
          <Listbox value={statusParam} onChange={handleStatusChange}>
            {STATUS_FILTER_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Sort By */}
          <Listbox value={sortByParam} onChange={handleSortByChange}>
            {SORT_BY_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Sort Order */}
          <Listbox value={sortOrderParam} onChange={handleSortOrderChange}>
            {SORT_ORDER_OPTIONS.map((option) => (
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

        {/* Search and Add Button */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* Search Input */}
          <InputGroup>
            <Search data-slot="icon" className="text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Visual Novel"
              value={searchParam}
              onChange={handleSearchChange}
              className="w-full max-w-xs"
            />
          </InputGroup>

          {/* Add New Visual Novel Button */}
          <Button
            color="primary"
            className="shrink-0"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus data-slot="icon" />
            Create Visual Novel
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableVisualNovel
        loading={isLoading && !mock}
        totalDocs={processedData.totalDocs}
        data={processedData.visualNovels}
        pagination={processedData.pagination}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        onPublish={handlePublish}
        onDuplicate={handleDuplicate}
      />

      {/* Create Visual Novel Dialog */}
      <DialogCreateVisualNovel
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={createMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DialogDeleteConfirmation
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setVisualNovelToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        itemType="visual novel"
        itemName={visualNovelToDelete?.title}
      />
    </div>
  );
}

const DashboardVisualNovelsPage: React.FC<DashboardVisualNovelsPageProps> = (
  props,
) => {
  return (
    <Suspense fallback={<div className="animate-pulse p-6">Loading...</div>}>
      <DashboardVisualNovelsPageContent {...props} />
    </Suspense>
  );
};

export default DashboardVisualNovelsPage;
