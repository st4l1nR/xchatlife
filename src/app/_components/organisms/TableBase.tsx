import React from "react";
import clsx from "clsx";
import TableReact, { type TableReactProps } from "./TableReact";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";
import { createColumnHelper } from "@tanstack/react-table";

export type TableBaseProps = {
  className?: string;
  loading: boolean;
  totalDocs: number;
} & Omit<TableReactProps<any>, "columns">;
const TableBase: React.FC<TableBaseProps> = ({
  className,
  data,
  totalDocs,
  pagination,
  columnFilters,
  loading,
}) => {
  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor("Test", {
      header: "Test",
      cell: (info) => info.getValue() || "N/A",
    }),
  ];
  return (
    <WrapperLoader
      className={clsx(className)}
      loading={loading}
      totalDocs={totalDocs}
    >
      <TableReact
        columns={columns}
        data={data}
        columnFilters={columnFilters}
        pagination={pagination}
      />
      <div>Loading</div>
      <CardEmptyState />
    </WrapperLoader>
  );
};

export default TableBase;
