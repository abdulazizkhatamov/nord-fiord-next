import { IconDots } from "@tabler/icons-react";

import type { Row } from "@tanstack/react-table";
import Link from "next/link";
import { categorySchema } from "../../data/category";
import { ActionIcon, Menu } from "@mantine/core";

interface TableRowActionsProps<TData> {
  row: Row<TData>;
}

export function TableRowActions<TData>({ row }: TableRowActionsProps<TData>) {
  const category = categorySchema.parse(row.original);

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="default">
          <IconDots />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Link href={`/admin/categories/${category.id}/edit`}>
          <Menu.Item>Редактировать</Menu.Item>
        </Link>
      </Menu.Dropdown>
    </Menu>
  );
}
