"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import clsx from "clsx";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Plus } from "lucide-react";
import TableCharacter from "../organisms/TableCharacter";
import { Button } from "../atoms/button";
import { Input, InputGroup } from "../atoms/input";
import { Listbox, ListboxOption, ListboxLabel } from "../atoms/listbox";
import { api } from "@/trpc/react";
import type {
  TableCharacterItem,
  CharacterStyleType,
  CharacterStatusType,
} from "../organisms/TableCharacter";

// Filter options
const STYLE_FILTER_OPTIONS = [
  { value: "", label: "All Styles" },
  { value: "anime", label: "Anime" },
  { value: "realistic", label: "Realistic" },
] as const;

const SORT_BY_OPTIONS = [
  { value: "createdAt", label: "Date" },
  { value: "likeCount", label: "Likes" },
  { value: "chatCount", label: "Chats" },
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

export type DashboardCharactersPageMockData = {
  characters: TableCharacterItem[];
  pagination: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
};

export type DashboardCharactersPageProps = {
  className?: string;
  mock?: DashboardCharactersPageMockData;
};

function DashboardCharactersPageContent({
  className,
  mock,
}: DashboardCharactersPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL params
  const styleParam = searchParams.get("style") ?? "";
  const sortByParam = searchParams.get("sortBy") ?? "createdAt";
  const sortOrderParam = searchParams.get("sortOrder") ?? "desc";
  const searchParam = searchParams.get("search") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const sizeParam = searchParams.get("size") ?? "10";

  // Dialog state (placeholder for future implementation)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  // Suppress unused variable warning - will be used when dialog is implemented
  void isCreateDialogOpen;

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
  const handleStyleChange = useCallback(
    (value: string) => {
      updateParams({ style: value, page: "1" });
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

  // Fetch characters (disabled when using mock data)
  const { data: charactersData, isLoading } =
    api.character.getForDashboard.useQuery(
      {
        page: pageParam,
        limit: parseInt(sizeParam, 10),
        search: searchParam || undefined,
        style: styleParam ? (styleParam as "anime" | "realistic") : undefined,
        sortBy: sortByParam as "createdAt" | "likeCount" | "chatCount",
        sortOrder: sortOrderParam as "asc" | "desc",
      },
      {
        enabled: !mock,
      },
    );

  // Process data - either from API or mock
  const processedData = useMemo(() => {
    if (mock) {
      // Apply client-side filtering for mock data
      let filtered = mock.characters;

      if (styleParam) {
        filtered = filtered.filter(
          (character) => character.style === styleParam,
        );
      }
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        filtered = filtered.filter(
          (character) =>
            character.name.toLowerCase().includes(searchLower) ||
            character.username.toLowerCase().includes(searchLower),
        );
      }

      // Apply sorting for mock data
      if (sortByParam === "likeCount") {
        filtered = [...filtered].sort((a, b) =>
          sortOrderParam === "desc" ? b.likes - a.likes : a.likes - b.likes,
        );
      } else if (sortByParam === "chatCount") {
        filtered = [...filtered].sort((a, b) =>
          sortOrderParam === "desc" ? b.chats - a.chats : a.chats - b.chats,
        );
      }
      // createdAt sorting is handled by default order in mock data

      // Apply pagination
      const pageSize = parseInt(sizeParam, 10);
      const startIndex = (pageParam - 1) * pageSize;
      const paginatedCharacters = filtered.slice(
        startIndex,
        startIndex + pageSize,
      );

      return {
        characters: paginatedCharacters,
        totalDocs: filtered.length,
        pagination: {
          page: pageParam,
          total: filtered.length,
          totalPage: Math.ceil(filtered.length / pageSize),
          size: pageSize,
        },
      };
    }

    // Transform API data to match TableCharacterItem type
    const characters: TableCharacterItem[] =
      charactersData?.data?.characters.map((character) => ({
        id: character.id,
        name: character.name,
        username: character.username,
        avatarSrc: character.avatarSrc ?? undefined,
        style: character.style as CharacterStyleType,
        likes: character.likes,
        chats: character.chats,
        status: character.status as CharacterStatusType,
      })) ?? [];

    return {
      characters,
      totalDocs: charactersData?.data?.pagination.total ?? 0,
      pagination: charactersData?.data?.pagination
        ? {
            page: charactersData.data.pagination.page,
            total: charactersData.data.pagination.total,
            totalPage: charactersData.data.pagination.totalPages,
            size: charactersData.data.pagination.limit,
          }
        : undefined,
    };
  }, [
    mock,
    charactersData,
    styleParam,
    searchParam,
    sortByParam,
    sortOrderParam,
    pageParam,
    sizeParam,
  ]);

  // Action handlers
  const handleDelete = useCallback((id: string) => {
    console.log("Delete character:", id);
  }, []);

  const handleView = useCallback((id: string) => {
    console.log("View character:", id);
  }, []);

  const handleMore = useCallback((id: string) => {
    console.log("More options:", id);
  }, []);

  return (
    <div className={clsx("space-y-6", className)}>
      {/* Filters Card */}
      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Filters</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Style Filter */}
          <Listbox value={styleParam} onChange={handleStyleChange}>
            {STYLE_FILTER_OPTIONS.map((option) => (
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
              placeholder="Search Character"
              value={searchParam}
              onChange={handleSearchChange}
              className="w-full max-w-xs"
            />
          </InputGroup>

          {/* Add New Character Button */}
          <Button
            color="primary"
            onClick={() => setIsCreateDialogOpen(true)}
            className="shrink-0"
          >
            <Plus data-slot="icon" />
            Add New Character
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableCharacter
        loading={isLoading && !mock}
        totalDocs={processedData.totalDocs}
        data={processedData.characters}
        pagination={processedData.pagination}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
        onView={handleView}
        onMore={handleMore}
      />
    </div>
  );
}

const DashboardCharactersPage: React.FC<DashboardCharactersPageProps> = (
  props,
) => {
  return (
    <Suspense fallback={<div className="animate-pulse p-6">Loading...</div>}>
      <DashboardCharactersPageContent {...props} />
    </Suspense>
  );
};

export default DashboardCharactersPage;
