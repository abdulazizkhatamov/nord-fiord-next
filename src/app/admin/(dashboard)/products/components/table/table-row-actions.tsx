import { IconDots } from "@tabler/icons-react";

import type { Row } from "@tanstack/react-table";
import Link from "next/link";
import { ActionIcon, Menu } from "@mantine/core";
import { productSchema } from "../../data/product";

interface TableRowActionsProps<TData> {
  row: Row<TData>;
}

export function TableRowActions<TData>({ row }: TableRowActionsProps<TData>) {
  const product = productSchema.parse(row.original);

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="default">
          <IconDots />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Link href={`/admin/products/${product.id}/edit`}>
          <Menu.Item>Редактировать</Menu.Item>
        </Link>
      </Menu.Dropdown>
    </Menu>
  );
}
