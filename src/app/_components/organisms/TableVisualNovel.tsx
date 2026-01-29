"use client";

import React from "react";
import clsx from "clsx";
import {
  createColumnHelper,
  type SortingState,
  type OnChangeFn,
  type ColumnFilter,
} from "@tanstack/react-table";
import TableReact from "./TableReact";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";
import { Avatar } from "../atoms/avatar";
import { Badge } from "../atoms/badge";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "../atoms/dropdown";
import {
  TrashIcon,
  EyeIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  GlobeAltIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

export type VisualNovelStatusType = "published" | "draft";

export type TableVisualNovelItem = {
  id: string;
  title: string;
  description?: string;
  thumbnailSrc?: string;
  status: VisualNovelStatusType;
  nodesCount: number;
  edgesCount: number;
  charactersCount: number;
  createdAt: string;
};

export type TableVisualNovelProps = {
  className?: string;
  loading: boolean;
  totalDocs: number;
  data: TableVisualNovelItem[];
  pagination?: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
  sorting?: SortingState;
  columnFilters?: ColumnFilter[];
  onSortingChange?: OnChangeFn<SortingState>;
  onPageChange?: (page: number) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onPublish?: (id: string) => void;
  onDuplicate?: (id: string) => void;
};

const TableVisualNovel: React.FC<TableVisualNovelProps> = ({
  className,
  loading,
  totalDocs,
  data,
  pagination,
  sorting,
  columnFilters,
  onSortingChange,
  onPageChange,
  onDelete,
  onView,
  onEdit,
  onPublish,
  onDuplicate,
}) => {
  const columnHelper = createColumnHelper<TableVisualNovelItem>();

  const columns = [
    // TITLE Column - Thumbnail + Title + Description
    columnHelper.accessor("title", {
      header: "Visual Novel",
      enableSorting: true,
      cell: (info) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={info.row.original.thumbnailSrc}
            initials={info.row.original.title.charAt(0).toUpperCase()}
            alt={info.row.original.title}
            className="size-10"
            square
          />
          <div className="flex flex-col">
            <span className="text-foreground font-medium">
              {info.getValue()}
            </span>
            {info.row.original.description && (
              <span className="text-muted-foreground line-clamp-1 max-w-xs text-sm">
                {info.row.original.description}
              </span>
            )}
          </div>
        </div>
      ),
    }),

    // NODES Column - Number of nodes
    columnHelper.accessor("nodesCount", {
      header: "Nodes",
      enableSorting: true,
      cell: (info) => (
        <span className="text-foreground">{info.getValue()}</span>
      ),
    }),

    // CHARACTERS Column - Number of characters
    columnHelper.accessor("charactersCount", {
      header: "Characters",
      enableSorting: true,
      cell: (info) => (
        <span className="text-foreground">{info.getValue()}</span>
      ),
    }),

    // CREATED AT Column - Date
    columnHelper.accessor("createdAt", {
      header: "Created",
      enableSorting: true,
      cell: (info) => {
        const date = new Date(info.getValue());
        return (
          <span className="text-muted-foreground text-sm">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      },
    }),

    // STATUS Column - Badge
    columnHelper.accessor("status", {
      header: "Status",
      enableSorting: true,
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge color={status === "published" ? "green" : "zinc"}>
            {status === "published" ? "Published" : "Draft"}
          </Badge>
        );
      },
    }),

    // ACTION Column - Delete, View, Edit buttons + Dropdown with Publish/Unpublish
    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: (info) => {
        const isPublished = info.row.original.status === "published";
        return (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onDelete?.(info.row.original.id)}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1.5 transition-colors"
              aria-label="Delete visual novel"
            >
              <TrashIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onView?.(info.row.original.id)}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1.5 transition-colors"
              aria-label="View visual novel"
            >
              <EyeIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit?.(info.row.original.id)}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1.5 transition-colors"
              aria-label="Edit visual novel"
            >
              <PencilIcon className="size-4" />
            </button>
            <Dropdown>
              <DropdownButton plain className="p-1.5">
                <EllipsisVerticalIcon className="size-4" />
              </DropdownButton>
              <DropdownMenu anchor="bottom end">
                <DropdownItem onClick={() => onPublish?.(info.row.original.id)}>
                  <GlobeAltIcon className="size-4" />
                  {isPublished ? "Unpublish" : "Publish"}
                </DropdownItem>
                <DropdownItem
                  onClick={() => onDuplicate?.(info.row.original.id)}
                >
                  <DocumentDuplicateIcon className="size-4" />
                  Duplicate
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      },
    }),
  ];

  return (
    <WrapperLoader
      className={clsx(className)}
      loading={loading}
      totalDocs={totalDocs}
    >
      {/* First child: Actual content */}
      <TableReact
        columns={columns}
        data={data}
        pagination={pagination}
        sorting={sorting}
        columnFilters={columnFilters}
        onSortingChange={onSortingChange}
        onPageChange={onPageChange}
      />

      {/* Second child: Loading skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-muted animate-pulse rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              <div className="bg-muted-foreground/20 size-10 rounded" />
              <div className="flex-1 space-y-2">
                <div className="bg-muted-foreground/20 h-4 w-32 rounded" />
                <div className="bg-muted-foreground/20 h-3 w-24 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Third child: Empty state */}
      <CardEmptyState
        title="No visual novels found"
        description="Create your first visual novel to get started."
      />
    </WrapperLoader>
  );
};

export default TableVisualNovel;
