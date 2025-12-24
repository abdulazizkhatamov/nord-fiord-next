import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { ActionIcon, Group, Select, Text } from "@mantine/core";

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  return (
    <Group justify="space-between" px="xs">
      <Text size="sm" c="dimmed">
        {table.getFilteredSelectedRowModel().rows.length} из{" "}
        {table.getFilteredRowModel().rows.length} строк выбрано.
      </Text>

      <Group gap="xl">
        <Group gap="xs">
          <Text size="sm" fw={500}>
            Строки на странице
          </Text>
          <Select
            size="xs"
            w={70}
            value={`${table.getState().pagination.pageSize}`}
            onChange={(value) => {
              if (value) table.setPageSize(Number(value));
            }}
            data={[10, 20, 30, 40, 50].map((v) => ({
              value: `${v}`,
              label: `${v}`,
            }))}
          />
        </Group>

        <Text size="sm" fw={500} w={120} ta="center">
          Страница {table.getState().pagination.pageIndex + 1} из{" "}
          {table.getPageCount()}
        </Text>

        <Group gap="xs">
          <ActionIcon
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            visibleFrom="lg"
            aria-label="Go to first page"
          >
            <IconChevronsLeft size={16} />
          </ActionIcon>

          <ActionIcon
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <IconChevronLeft size={16} />
          </ActionIcon>

          <ActionIcon
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <IconChevronRight size={16} />
          </ActionIcon>

          <ActionIcon
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            visibleFrom="lg"
            aria-label="Go to last page"
          >
            <IconChevronsRight size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Group>
  );
}
