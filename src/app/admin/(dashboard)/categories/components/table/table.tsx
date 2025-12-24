"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationOptions,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import { Filters } from "@/types/api-types";
import { Box, Skeleton, Table } from "@mantine/core";
import { TablePagination } from "@/components/table/table-pagination";
import { TableToolbar } from "./table-toolbar";

interface TableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  pagination: PaginationState;
  paginationOptions: Pick<PaginationOptions, "onPaginationChange" | "rowCount">;
  filters: Filters<TData>;
  sorting: SortingState;
  isLoading?: boolean;
  onSortingChange: OnChangeFn<SortingState>;
  onFilterChange: (dataFilters: Partial<TData>) => void;
}

export function CategoriesTable<TData, TValue>({
  columns,
  data,
  pagination,
  paginationOptions,
  filters,
  sorting,
  isLoading,
  onSortingChange,
  onFilterChange,
}: TableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    columns,
    data,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    ...paginationOptions,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box>
      <TableToolbar
        table={table}
        onFilterChange={onFilterChange}
        filters={filters}
      />
      <Box
        style={{
          position: "relative",
          marginTop: "1rem",
          marginBottom: "1rem",
          borderRadius: "0.375rem",
          height: "80vh",
        }}
      >
        <Box style={{ overflowY: "auto", height: "100%" }}>
          <Table
            stickyHeader
            withTableBorder
            highlightOnHover
            style={{ width: "100%" }}
          >
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Table.Th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Table.Th>
                    );
                  })}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                <TableSkeleton columns={columns.length} />
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <Table.Tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Box>
      </Box>
      <TablePagination table={table} />
    </Box>
  );
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, idx) => (
        <Table.Tr key={idx}>
          {Array.from({ length: columns }).map((_c, cellIdx) => (
            <Table.Td key={cellIdx}>
              <Skeleton h={20} />
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </>
  );
}
