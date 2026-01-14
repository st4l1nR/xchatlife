"use client";

import React from "react";
import clsx from "clsx";
import millify from "millify";
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
  SparklesIcon,
  UserIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

export type CharacterStyleType = "anime" | "realistic";
export type CharacterStatusType = "published" | "draft";

export type TableCharacterItem = {
  id: string;
  name: string;
  username: string;
  avatarSrc?: string;
  style: CharacterStyleType;
  likes: number;
  chats: number;
  status: CharacterStatusType;
};

export type TableCharacterProps = {
  className?: string;
  loading: boolean;
  totalDocs: number;
  data: TableCharacterItem[];
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
  onMore?: (id: string) => void;
};

const TableCharacter: React.FC<TableCharacterProps> = ({
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
  onMore,
}) => {
  const columnHelper = createColumnHelper<TableCharacterItem>();

  const columns = [
    // CHARACTER Column - Avatar + Name + Username
    columnHelper.accessor("name", {
      header: "Character",
      enableSorting: true,
      cell: (info) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={info.row.original.avatarSrc}
            initials={info.row.original.name.charAt(0).toUpperCase()}
            alt={info.row.original.name}
            className="size-10"
          />
          <div className="flex flex-col">
            <span className="text-foreground font-medium">
              {info.getValue()}
            </span>
            <span className="text-muted-foreground text-sm">
              {info.row.original.username}
            </span>
          </div>
        </div>
      ),
    }),

    // STYLE Column - Icon + Text
    columnHelper.accessor("style", {
      header: "Style",
      enableSorting: true,
      cell: (info) => {
        const style = info.getValue();
        const isAnime = style === "anime";
        return (
          <div className="flex items-center gap-2">
            {isAnime ? (
              <SparklesIcon className="text-muted-foreground size-4" />
            ) : (
              <UserIcon className="text-muted-foreground size-4" />
            )}
            <span className="capitalize">{style}</span>
          </div>
        );
      },
    }),

    // LIKES Column - Formatted number
    columnHelper.accessor("likes", {
      header: "Likes",
      enableSorting: true,
      cell: (info) => millify(info.getValue()),
    }),

    // CHATS Column - Formatted number
    columnHelper.accessor("chats", {
      header: "Chats",
      enableSorting: true,
      cell: (info) => millify(info.getValue()),
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

    // ACTION Column - Delete, View, More buttons
    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: (info) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onDelete?.(info.row.original.id)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1.5 transition-colors"
            aria-label="Delete character"
          >
            <TrashIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onView?.(info.row.original.id)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1.5 transition-colors"
            aria-label="View character"
          >
            <EyeIcon className="size-4" />
          </button>
          <Dropdown>
            <DropdownButton plain className="p-1.5">
              <EllipsisVerticalIcon className="size-4" />
            </DropdownButton>
            <DropdownMenu anchor="bottom end">
              <DropdownItem onClick={() => onEdit?.(info.row.original.id)}>
                <PencilIcon className="size-4" />
                Edit
              </DropdownItem>
              <DropdownItem onClick={() => onMore?.(info.row.original.id)}>
                More options
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ),
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
              <div className="bg-muted-foreground/20 size-10 rounded-full" />
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
        title="No characters found"
        description="Create your first character to get started."
      />
    </WrapperLoader>
  );
};

export default TableCharacter;
