import type { ColumnDef, RowData } from "@tanstack/react-table";
import { TableColumnHeader } from "@/components/table/table-column-header";
import { TableRowActions } from "./table-row-actions";
import { Flex } from "@mantine/core";
import { ProductType } from "../../data/product";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: keyof TData;
    filterVariant?: "text" | "number";
  }
}

export const productColumns: Array<ColumnDef<ProductType>> = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Название продукта" />
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
