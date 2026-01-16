"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import clsx from "clsx";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Plus } from "lucide-react";
import toast from "react-hot-toast";
import TableFinancialTransaction from "../organisms/TableFinancialTransaction";
import StatsFinancialTransactions from "../molecules/StatsFinancialTransactions";
import type { StatsFinancialTransactionsVariant } from "../molecules/StatsFinancialTransactions";
import DialogCreateUpdateFinancialTransaction from "../organisms/DialogCreateUpdateFinancialTransaction";
import type { ExistingTransaction } from "../organisms/DialogCreateUpdateFinancialTransaction";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../atoms/dialog";
import type {
  TableFinancialTransactionItem,
  FinancialTypeValue,
} from "../organisms/TableFinancialTransaction";
import { Input, InputGroup } from "../atoms/input";
import { Listbox, ListboxOption, ListboxLabel } from "../atoms/listbox";
import { Button } from "../atoms/button";
import { api } from "@/trpc/react";
import { useDebounce } from "@/hooks/useDebounce";

// Filter options
const TYPE_FILTER_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
] as const;

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
] as const;

export type DashboardFinancialTransactionsPageMockData = {
  transactions: TableFinancialTransactionItem[];
  summary: {
    totalIncome: string;
    totalExpense: string;
    netBalance: string;
    transactionCount: number;
  };
  categories: { id: string; label: string }[];
  providers: string[];
  pagination: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
};

export type DashboardFinancialTransactionsPageProps = {
  className?: string;
  mock?: DashboardFinancialTransactionsPageMockData;
};

function DashboardFinancialTransactionsPageContent({
  className,
  mock,
}: DashboardFinancialTransactionsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL params
  const typeParam = searchParams.get("type") ?? "";
  const categoryParam = searchParams.get("category") ?? "";
  const providerParam = searchParams.get("provider") ?? "";
  const searchParam = searchParams.get("search") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const sizeParam = searchParams.get("size") ?? "10";
  const actionParam = searchParams.get("action");

  // Local search state for debounce
  const [searchInputValue, setSearchInputValue] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInputValue, 400);

  // Dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ExistingTransaction | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

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

  // Open create dialog when action=create param is present
  React.useEffect(() => {
    if (actionParam === "create") {
      setIsCreateDialogOpen(true);
      // Remove action param from URL to prevent reopening on refresh
      const params = new URLSearchParams(searchParams.toString());
      params.delete("action");
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl);
    }
  }, [actionParam, pathname, router, searchParams]);

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

  const handleCategoryChange = useCallback(
    (value: string) => {
      updateParams({ category: value, page: "1" });
    },
    [updateParams]
  );

  const handleProviderChange = useCallback(
    (value: string) => {
      updateParams({ provider: value, page: "1" });
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

  // Fetch categories for filter dropdown
  const { data: categoriesData } = api.financialCategory.getAll.useQuery(
    {
      isActive: true,
      limit: 100,
    },
    { enabled: !mock }
  );

  // Fetch providers for filter dropdown
  const { data: providersData } =
    api.financialTransaction.getProviders.useQuery(undefined, { enabled: !mock });

  // Fetch summary stats
  const { data: summaryData } = api.financialTransaction.getSummary.useQuery(
    undefined,
    { enabled: !mock }
  );

  // Build category filter options dynamically
  const categoryFilterOptions = useMemo(() => {
    const baseOptions = [{ value: "", label: "All Categories" }];

    if (mock?.categories) {
      const categoryOptions = mock.categories.map((cat) => ({
        value: cat.id,
        label: cat.label,
      }));
      return [...baseOptions, ...categoryOptions];
    }

    if (categoriesData?.data?.categories) {
      const categoryOptions = categoriesData.data.categories.map((cat) => ({
        value: cat.id,
        label: cat.label,
      }));
      return [...baseOptions, ...categoryOptions];
    }

    return baseOptions;
  }, [mock, categoriesData]);

  // Build provider filter options dynamically
  const providerFilterOptions = useMemo(() => {
    const baseOptions = [{ value: "", label: "All Providers" }];

    if (mock?.providers) {
      const options = mock.providers.map((provider) => ({
        value: provider,
        label: provider,
      }));
      return [...baseOptions, ...options];
    }

    if (providersData?.data) {
      const options = providersData.data.map((provider) => ({
        value: provider,
        label: provider,
      }));
      return [...baseOptions, ...options];
    }

    return baseOptions;
  }, [mock, providersData]);

  // Fetch transactions (disabled when using mock data)
  const { data: transactionsData, isLoading } =
    api.financialTransaction.getForDashboard.useQuery(
      {
        page: pageParam,
        limit: parseInt(sizeParam, 10),
        search: searchParam || undefined,
        type: (typeParam as FinancialTypeValue) || undefined,
        categoryId: categoryParam || undefined,
        provider: providerParam || undefined,
      },
      { enabled: !mock }
    );

  const utils = api.useUtils();

  // Delete mutation
  const deleteTransaction = api.financialTransaction.delete.useMutation({
    onSuccess: () => {
      toast.success("Transaction deleted successfully");
      void utils.financialTransaction.invalidate();
      setIsDeleteDialogOpen(false);
      setSelectedTransactionId(null);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete transaction");
    },
  });

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      // Apply client-side filtering for mock data
      let filtered = mock.transactions;

      if (typeParam) {
        filtered = filtered.filter((t) => t.type === typeParam);
      }
      if (categoryParam) {
        filtered = filtered.filter((t) => t.categoryName === categoryParam);
      }
      if (providerParam) {
        filtered = filtered.filter((t) => t.provider === providerParam);
      }
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.description?.toLowerCase().includes(searchLower) ||
            t.categoryLabel?.toLowerCase().includes(searchLower) ||
            t.provider?.toLowerCase().includes(searchLower)
        );
      }

      // Apply pagination
      const pageSize = parseInt(sizeParam, 10);
      const startIndex = (pageParam - 1) * pageSize;
      const paginatedTransactions = filtered.slice(
        startIndex,
        startIndex + pageSize
      );

      return {
        transactions: paginatedTransactions,
        totalDocs: filtered.length,
        pagination: {
          page: pageParam,
          total: filtered.length,
          totalPage: Math.ceil(filtered.length / pageSize),
          size: pageSize,
        },
      };
    }

    const transactions: TableFinancialTransactionItem[] =
      transactionsData?.data?.transactions.map((transaction) => ({
        id: transaction.id,
        categoryLabel: transaction.categoryLabel,
        categoryName: transaction.categoryName,
        type: transaction.type as FinancialTypeValue,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        provider: transaction.provider,
        unitType: transaction.unitType,
        unitCount: transaction.unitCount,
        userName: transaction.userName,
        affiliateName: transaction.affiliateName,
        createdAt: transaction.createdAt,
      })) ?? [];

    return {
      transactions,
      totalDocs: transactionsData?.data?.pagination?.total ?? 0,
      pagination: transactionsData?.data?.pagination,
    };
  }, [mock, transactionsData, typeParam, categoryParam, providerParam, searchParam, pageParam, sizeParam]);

  // Action handlers
  const handleEdit = useCallback(
    (id: string) => {
      const transaction = transactionsData?.data?.transactions.find(
        (t) => t.id === id
      );
      if (transaction) {
        setSelectedTransaction({
          id: transaction.id,
          categoryId: transaction.categoryId,
          amount: transaction.amount,
          currency: transaction.currency,
          description: transaction.description,
          provider: transaction.provider,
          unitType: transaction.unitType as
            | "message"
            | "image"
            | "video"
            | "audio"
            | null,
          unitCount: transaction.unitCount,
          notes: transaction.notes,
          periodStart: transaction.periodStart,
          periodEnd: transaction.periodEnd,
        });
        setIsEditDialogOpen(true);
      }
    },
    [transactionsData]
  );

  const handleDelete = useCallback((id: string) => {
    setSelectedTransactionId(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedTransactionId) {
      deleteTransaction.mutate({ id: selectedTransactionId });
    }
  }, [selectedTransactionId, deleteTransaction]);

  const handleCreateSuccess = useCallback(() => {
    void utils.financialTransaction.invalidate();
  }, [utils.financialTransaction]);

  // Stats cards data
  const stats = useMemo(() => {
    if (mock?.summary) {
      return mock.summary;
    }

    if (!summaryData?.data) {
      return {
        totalIncome: "0.00",
        totalExpense: "0.00",
        netBalance: "0.00",
        transactionCount: 0,
      };
    }
    return summaryData.data;
  }, [mock, summaryData]);

  const netBalanceValue = parseFloat(stats.netBalance);

  // Build stats items for StatsFinancialTransactions component
  const statsItems = useMemo(() => {
    const balanceVariant: StatsFinancialTransactionsVariant =
      netBalanceValue >= 0 ? "balance-positive" : "balance-negative";
    const balancePrefix = netBalanceValue >= 0 ? "+" : "";

    return [
      {
        label: "Total Income",
        value: `$${stats.totalIncome}`,
        variant: "income" as const,
      },
      {
        label: "Total Expense",
        value: `$${stats.totalExpense}`,
        variant: "expense" as const,
      },
      {
        label: "Net Balance",
        value: `${balancePrefix}$${stats.netBalance}`,
        variant: balanceVariant,
      },
      {
        label: "Total Transactions",
        value: stats.transactionCount,
        variant: "neutral" as const,
      },
    ];
  }, [stats, netBalanceValue]);

  return (
    <div className={clsx("space-y-6 p-5", className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Financial Transactions
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage income and expense transactions
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus data-slot="icon" />
          Add Transaction
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsFinancialTransactions stats={statsItems} />

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

          {/* Category Filter */}
          <Listbox value={categoryParam} onChange={handleCategoryChange}>
            {categoryFilterOptions.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                <ListboxLabel>{option.label}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>

          {/* Provider Filter */}
          <Listbox value={providerParam} onChange={handleProviderChange}>
            {providerFilterOptions.map((option) => (
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
          <span className="text-muted-foreground text-sm">Show</span>
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
          <span className="text-muted-foreground text-sm">entries</span>
        </div>

        {/* Search Input */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <InputGroup>
            <Search data-slot="icon" className="text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              value={searchInputValue}
              onChange={handleSearchChange}
              className="w-full max-w-xs"
            />
          </InputGroup>
        </div>
      </div>

      {/* Table */}
      <TableFinancialTransaction
        loading={isLoading && !mock}
        totalDocs={processedData.totalDocs}
        data={processedData.transactions}
        pagination={processedData.pagination}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create Dialog */}
      <DialogCreateUpdateFinancialTransaction
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        mode="create"
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Dialog */}
      <DialogCreateUpdateFinancialTransaction
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedTransaction(null);
        }}
        mode="update"
        existingTransaction={selectedTransaction ?? undefined}
        onSuccess={handleCreateSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => {
          if (!deleteTransaction.isPending) {
            setIsDeleteDialogOpen(false);
            setSelectedTransactionId(null);
          }
        }}
        size="md"
      >
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this transaction? This action cannot
          be undone.
        </DialogDescription>
        <DialogBody />
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setIsDeleteDialogOpen(false);
              setSelectedTransactionId(null);
            }}
            disabled={deleteTransaction.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleConfirmDelete}
            loading={deleteTransaction.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const DashboardFinancialTransactionsPage: React.FC<
  DashboardFinancialTransactionsPageProps
> = (props) => {
  return (
    <Suspense fallback={<div className="animate-pulse p-5">Loading...</div>}>
      <DashboardFinancialTransactionsPageContent {...props} />
    </Suspense>
  );
};

export default DashboardFinancialTransactionsPage;
