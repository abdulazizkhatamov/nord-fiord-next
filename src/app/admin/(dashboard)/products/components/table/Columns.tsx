import Link from "next/link";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge, Flex } from "@mantine/core";
import { TableColumnHeader } from "@/components/table/table-column-header";
import { TableRowActions } from "./TableRowActions";
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
    cell: ({ row }) => (
      <Flex align={"center"}>
        <Link
          href={`/admin/products/${row.original.id}`} // assuming you have an `id` field
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {row.getValue("name")}
        </Link>
      </Flex>
    ),
    meta: { filterKey: "name", filterVariant: "text" },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "availability",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Наличие" />
    ),
    cell: ({ row }) => {
      const available = row.getValue<boolean>("availability");
      return (
        <Badge color={available ? "green" : "red"} variant="light">
          {available ? "В наличии" : "Нет в наличии"}
        </Badge>
      );
    },
    meta: { filterKey: "availability", filterVariant: "text" },
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Дата создания" />
    ),
    cell: ({ row }) => {
      const date = row.getValue<Date>("createdAt");
      return (
        <span>{date ? format(new Date(date), "dd MMM yyyy, HH:mm") : "-"}</span>
      );
    },
    meta: { filterKey: "createdAt", filterVariant: "text" },
    enableSorting: true,
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
