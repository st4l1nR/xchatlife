"use client";
import React, { Suspense } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnFilter,
  type OnChangeFn,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../atoms/table";
import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "../atoms/pagination";
import { generateFromObj } from "@bramus/pagination-sequence";
import { useSearchParams } from "next/navigation";
import qs from "query-string";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

type PaginationInput = {
  page: number;
  total: number;
  totalPage: number;
  size: number;
};
export type TableReactProps<T = any> = {
  className?: string;
  data: T[];
  columns: any[];
  sorting?: SortingState;
  pagination?: PaginationInput;
  columnFilters?: ColumnFilter[];
  onSortingChange?: OnChangeFn<SortingState> | undefined;
  onPageChange?: (page: number) => void;
  rows?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const TablelReact: React.FC<TableReactProps> = ({
  className: _className,
  id,
  data = [],
  columns = [],
  pagination,
  columnFilters,
  sorting,
  onSortingChange,
  onPageChange,
  rows: _rows,
}) => {
  const searchParams = useSearchParams();
  const params = qs.parse(searchParams?.toString() ?? "");
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      enableSorting: false,
    },
    onSortingChange,
  });

  const paginationArray = pagination
    ? generateFromObj({
        curPage: pagination.page,
        numPages: pagination.totalPage,
      })
    : [];

  // Handle page change: update URL without redirect + call external callback
  const handlePageChange = (newPage: number) => {
    // Update URL without page redirect using replaceState
    if (typeof window !== "undefined") {
      const newParams = qs.stringify(
        { ...params, page: newPage },
        { skipEmptyString: true, skipNull: true },
      );
      window.history.replaceState(
        { ...window.history.state },
        "",
        `?${newParams}${id ? `#${id}` : ""}`,
      );
    }

    // Call external callback if provided
    onPageChange?.(newPage);
  };

  return (
    <div>
      <div>
        <Table bleed id={id}>
          <TableHead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHeader key={header.id}>
                      <div
                        className="flex items-center justify-between gap-3"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
                        {header.column.getCanSort() && (
                          <div>
                            {header.column.getIsSorted() == "desc" && (
                              <ChevronDownIcon className="h-3 w-3" />
                            )}
                            {header.column.getIsSorted() == "asc" && (
                              <ChevronUpIcon className="h-3 w-3" />
                            )}
                            {!header.column.getIsSorted() && (
                              <ChevronUpDownIcon className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </TableHeader>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <Pagination className="mt-10 overflow-x-auto">
          <PaginationPrevious
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          />
          <PaginationList>
            {paginationArray.map((page, idx) => {
              if (page === "...") {
                return <PaginationGap key={idx} />;
              }
              return (
                <PaginationPage
                  key={idx}
                  onClick={() => handlePageChange(page as number)}
                  current={page == pagination.page}
                >
                  {page as any}
                </PaginationPage>
              );
            })}
          </PaginationList>
          <PaginationNext
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPage}
          />
        </Pagination>
      )}
    </div>
  );
};

const TableReactWrapper: React.FC<TableReactProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground text-sm">Loading table...</div>
        </div>
      }
    >
      <TablelReact {...props} />
    </Suspense>
  );
};

export default TableReactWrapper;
