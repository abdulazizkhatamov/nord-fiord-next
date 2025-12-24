import type { ColumnDef, RowData } from "@tanstack/react-table";
import { TableColumnHeader } from "@/components/table/table-column-header";
import { CategoryType } from "../../data/category";
import { TableRowActions } from "./table-row-actions";
import { Flex } from "@mantine/core";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: keyof TData;
    filterVariant?: "text" | "number";
  }
}

export const categoryColumns: Array<ColumnDef<CategoryType>> = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Название категории" />
    ),
    cell: ({ row }) => <Flex align={"center"}>{row.getValue("name")}</Flex>,
    meta: { filterKey: "name", filterVariant: "text" },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2 min-w-[80px]">
        <TableRowActions row={row} />
      </div>
    ),
  },
];
