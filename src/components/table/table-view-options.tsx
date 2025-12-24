import { IconSettings } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { Button, Checkbox, Menu, Text } from "@mantine/core";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function TableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <Menu position="bottom-end" shadow="md" width={180}>
      <Menu.Target>
        <Button
          variant="outline"
          size="sm"
          leftSection={<IconSettings size={16} />}
          visibleFrom="lg"
          ml="auto"
        >
          Вид
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Переключить столбцы</Menu.Label>

        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => (
            <Menu.Item key={column.id} closeMenuOnClick={false}>
              <Checkbox
                size="xs"
                label={
                  <Text tt="capitalize" size="sm">
                    {column.id}
                  </Text>
                }
                checked={column.getIsVisible()}
                onChange={(e) =>
                  column.toggleVisibility(e.currentTarget.checked)
                }
              />
            </Menu.Item>
          ))}
      </Menu.Dropdown>
    </Menu>
  );
}
