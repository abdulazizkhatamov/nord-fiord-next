import { IconPlus, IconX } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { Filters } from "@/types/api-types";
import { Button, Group } from "@mantine/core";
import Link from "next/link";
import { TableViewOptions } from "@/components/table/table-view-options";
import { DebouncedInput } from "@/components/ui/debounced-input";

interface TableToolbarProps<TData> {
  table: Table<TData>;
  filters: Filters<TData>;
  onFilterChange: (dataFilters: Partial<TData>) => void;
}

export function TableToolbar<TData>({
  table,
  filters,
  onFilterChange,
}: TableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const fieldMeta = table.getColumn("name")?.columnDef.meta;

  return (
    <Group justify="space-between" align="center" style={{ width: "100%" }}>
      {/* Left side: filter + reset */}
      <Group gap="sm" grow>
        {table.getColumn("name")?.getCanFilter() && fieldMeta?.filterKey && (
          <DebouncedInput
            type="text"
            placeholder="Категории фильтров..."
            value={String(filters[fieldMeta.filterKey] ?? "")}
            onChange={(value) =>
              onFilterChange({
                [fieldMeta.filterKey as keyof TData]: value,
              } as Partial<TData>)
            }
          />
        )}

        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            leftSection={<IconX size={16} />}
            onClick={() => table.resetColumnFilters()}
          >
            Сбросить
          </Button>
        )}
      </Group>

      {/* Right side: view options + create */}
      <Group gap="sm">
        <TableViewOptions table={table} />

        <Link href="/admin/categories/create">
          <Button size="sm" leftSection={<IconPlus size={16} />}>
            Создавать
          </Button>
        </Link>
      </Group>
    </Group>
  );
}
