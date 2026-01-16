"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import clsx from "clsx";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import TableFinancialCategory from "../organisms/TableFinancialCategory";
import DialogCreateUpdateFinancialCategory from "../organisms/DialogCreateUpdateFinancialCategory";
import type { ExistingFinancialCategory } from "../organisms/DialogCreateUpdateFinancialCategory";
import type {
  TableFinancialCategoryItem,
  FinancialTypeValue,
} from "../organisms/TableFinancialCategory";
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

// Filter options
const TYPE_FILTER_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
] as const;

const GROUP_FILTER_OPTIONS = [
  { value: "", label: "All Groups" },
  { value: "affiliates", label: "Affiliates" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "ai", label: "AI Services" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "tokens", label: "Tokens" },
  { value: "other", label: "Other" },
] as const;

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
] as const;

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
] as const;

export type DashboardFinancialCategoriesPageMockData = {
  categories: TableFinancialCategoryItem[];
  pagination: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
};

export type DashboardFinancialCategoriesPageProps = {
  className?: string;
  mock?: DashboardFinancialCategoriesPageMockData;
};

function DashboardFinancialCategoriesPageContent({
  className,
  mock,
}: DashboardFinancialCategoriesPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL params
  const typeParam = searchParams.get("type") ?? "";
  const groupParam = searchParams.get("group") ?? "";
  const statusParam = searchParams.get("status") ?? "";
  const searchParam = searchParams.get("search") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const sizeParam = searchParams.get("size") ?? "10";

  // Local search state for debounce
  const [searchInputValue, setSearchInputValue] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInputValue, 400);

  // Dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "update">("create");
  const [selectedCategory, setSelectedCategory] = useState<
    ExistingFinancialCategory | undefined
  >();
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    label: string;
  } | null>(null);

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
    [router, pathname, searchParams]
  );

  // Filter handlers
  const handleTypeChange = useCallback(
    (value: string) => {
      updateParams({ type: value, page: "1" });
    },
    [updateParams]
  );

  const handleGroupChange = useCallback(
    (value: string) => {
      updateParams({ group: value, page: "1" });
    },
    [updateParams]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      updateParams({ status: value, page: "1" });
    },
    [updateParams]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(e.target.value);
    },
    []
  );

  const handlePageSizeChange = useCallback(
    (value: string) => {
      updateParams({ size: value, page: "1" });
    },
    [updateParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateParams({ page: page.toString() });
    },
    [updateParams]
  );

  const utils = api.useUtils();

  // Fetch categories (disabled when using mock data)
  const { data: categoriesData, isLoading } =
    api.financialCategory.getAll.useQuery(
      {
        page: pageParam,
        limit: parseInt(sizeParam, 10),
        search: searchParam || undefined,
        type: (typeParam as FinancialTypeValue) || undefined,
        group: groupParam || undefined,
        isActive:
          statusParam === "true"
            ? true
            : statusParam === "false"
              ? false
              : undefined,
      },
      {
        enabled: !mock,
      }
    );

  // Delete mutation
  const deleteCategory = api.financialCategory.delete.useMutation({
    onSuccess: () => {
      toast.success("Category deleted successfully");
      void utils.financialCategory.invalidate();
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete category");
    },
  });

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      // Apply client-side filtering for mock data
      let filtered = mock.categories;

      if (typeParam) {
        filtered = filtered.filter((c) => c.type === typeParam);
      }
      if (groupParam) {
        filtered = filtered.filter((c) => c.group === groupParam);
      }
      if (statusParam) {
        const isActive = statusParam === "true";
        filtered = filtered.filter((c) => c.isActive === isActive);
      }
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(searchLower) ||
            c.label.toLowerCase().includes(searchLower) ||
            c.description?.toLowerCase().includes(searchLower)
        );
      }

      // Apply pagination
      const pageSize = parseInt(sizeParam, 10);
      const startIndex = (pageParam - 1) * pageSize;
      const paginatedCategories = filtered.slice(
        startIndex,
        startIndex + pageSize
      );

      return {
        categories: paginatedCategories,
        totalDocs: filtered.length,
        pagination: {
          page: pageParam,
          total: filtered.length,
          totalPage: Math.ceil(filtered.length / pageSize),
          size: pageSize,
        },
      };
    }

    const categories: TableFinancialCategoryItem[] =
      categoriesData?.data?.categories ?? [];

    return {
      categories,
      totalDocs: categoriesData?.data?.totalCount ?? 0,
      pagination: categoriesData?.data
        ? {
            page: categoriesData.data.page,
            total: categoriesData.data.totalCount,
            totalPage: categoriesData.data.totalPages,
            size: parseInt(sizeParam, 10),
          }
        : undefined,
    };
  }, [
    mock,
    categoriesData,
    typeParam,
    groupParam,
    statusParam,
    searchParam,
    pageParam,
    sizeParam,
  ]);

  // Action handlers
  const handleCreate = useCallback(() => {
    setSelectedCategory(undefined);
    setDialogMode("create");
    setIsCreateDialogOpen(true);
  }, []);

  const handleEdit = useCallback(
    (id: string) => {
      const category = processedData.categories.find((c) => c.id === id);
      if (category) {
        setSelectedCategory({
          id: category.id,
          name: category.name,
          label: category.label,
          type: category.type,
          group: category.group,
          description: category.description,
          sortOrder: category.sortOrder,
          isActive: category.isActive,
        });
        setDialogMode("update");
        setIsCreateDialogOpen(true);
      }
    },
    [processedData.categories]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const category = processedData.categories.find((c) => c.id === id);
      if (category) {
        setCategoryToDelete({ id: category.id, label: category.label });
        setIsDeleteDialogOpen(true);
      }
    },
    [processedData.categories]
  );

  const handleConfirmDelete = useCallback(() => {
    if (categoryToDelete) {
      deleteCategory.mutate({ id: categoryToDelete.id });
    }
  }, [categoryToDelete, deleteCategory]);

  const handleCloseCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(false);
    setSelectedCategory(undefined);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!deleteCategory.isPending) {
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  }, [deleteCategory.isPending]);

  return (
    <div className={clsx("space-y-6 p-5", className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">
            Financial Categories
          </h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            Manage categories used to organize and classify financial
            transactions. Categories help track income and expenses across
            different areas of the business.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus data-slot="icon" />
          Add Category
        </Button>
      </div>

      {/* Filters Card */}
      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Filters</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Type Filter */}
          <Listbox value={typeParam} onChange={handleTypeChange}>
            {TYPE_FILTER_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Group Filter */}
          <Listbox value={groupParam} onChange={handleGroupChange}>
            {GROUP_FILTER_OPTIONS.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Status Filter */}
          <Listbox value={statusParam} onChange={handleStatusChange}>
            {STATUS_FILTER_OPTIONS.map((option) => (
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
              placeholder="Search categories..."
              value={searchInputValue}
              onChange={handleSearchChange}
              className="w-full max-w-xs"
            />
          </InputGroup>
        </div>
      </div>

      {/* Table */}
      <TableFinancialCategory
        loading={isLoading && !mock}
        totalDocs={processedData.totalDocs}
        data={processedData.categories}
        pagination={processedData.pagination}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Update Dialog */}
      <DialogCreateUpdateFinancialCategory
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        mode={dialogMode}
        existingCategory={selectedCategory}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        size="md"
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this category? This action cannot be
          undone.
        </DialogDescription>
        <DialogBody>
          {categoryToDelete && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-foreground font-medium">
                {categoryToDelete.label}
              </p>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={handleCloseDeleteDialog}
            disabled={deleteCategory.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleConfirmDelete}
            loading={deleteCategory.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const DashboardFinancialCategoriesPage: React.FC<
  DashboardFinancialCategoriesPageProps
> = (props) => {
  return (
    <Suspense fallback={<div className="animate-pulse p-5">Loading...</div>}>
      <DashboardFinancialCategoriesPageContent {...props} />
    </Suspense>
  );
};

export default DashboardFinancialCategoriesPage;
