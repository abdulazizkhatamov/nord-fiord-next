import type { ColumnDef, RowData } from "@tanstack/react-table";
import { TableColumnHeader } from "@/components/table/table-column-header";
import { CategoryType } from "../../data/categorySchema";
import { TableRowActions } from "./TableRowActions";
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
      <Flex
        justify="flex-end"
        align="center"
        gap="sm"
        style={{ minWidth: 80, paddingRight: 20 }} // Add some right padding
      >
        <TableRowActions row={row} />
      </Flex>
    ),
  },
];
