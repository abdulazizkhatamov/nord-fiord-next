import {
  IconArrowDown,
  IconArrowUp,
  IconEyeOff,
  IconSelector,
} from "@tabler/icons-react";
import type { Column } from "@tanstack/react-table";
import { Button, Menu, Text } from "@mantine/core";

interface TableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function TableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: TableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <div className={className}>
      <Menu position="bottom-start" shadow="md">
        <Menu.Target>
          <Button
            variant="subtle"
            size="xs"
            leftSection={
              sorted === "desc" ? (
                <IconArrowDown size={14} />
              ) : sorted === "asc" ? (
                <IconArrowUp size={14} />
              ) : (
                <IconSelector size={14} />
              )
            }
            styles={{
              root: {
                paddingLeft: 4,
                paddingRight: 8,
              },
            }}
          >
            <Text size="sm">{title}</Text>
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconArrowUp size={14} />}
            onClick={() => column.toggleSorting(false)}
          >
            Асцендент
          </Menu.Item>
          <Menu.Item
            leftSection={<IconArrowDown size={14} />}
            onClick={() => column.toggleSorting(true)}
          >
            Потомок
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            color="red"
            leftSection={<IconEyeOff size={14} />}
            onClick={() => column.toggleVisibility(false)}
          >
            Скрывать
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
