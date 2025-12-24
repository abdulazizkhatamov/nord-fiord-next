import * as React from "react";
import { IconPlus } from "@tabler/icons-react";
import type { Column } from "@tanstack/react-table";
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  Group,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Filters } from "@/types/api-types";

interface TableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Array<{
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  filters: Filters<TData>;
  onFilterChange: (filters: Partial<TData>) => void;
}

export function TableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  filters,
  onFilterChange,
}: TableFacetedFilterProps<TData, TValue>) {
  const filterKey = column?.columnDef.meta?.filterKey ?? column?.id;
  const key = filterKey as keyof typeof filters;
  const values = filters[key] as Array<string> | undefined;
  const selectedValues = new Set(values ?? []);

  return (
    <Popover position="bottom-start" shadow="md">
      <Popover.Target>
        <Button
          variant="outline"
          size="xs"
          leftSection={<IconPlus size={14} />}
          styles={{
            root: { borderStyle: "dashed" },
          }}
        >
          <Group gap={6}>
            <Text size="sm">{title}</Text>

            {selectedValues.size > 0 && (
              <>
                <Divider orientation="vertical" />

                <Badge size="sm" variant="light" hiddenFrom="lg">
                  {selectedValues.size}
                </Badge>

                <Group gap={4} visibleFrom="lg">
                  {selectedValues.size > 2 ? (
                    <Badge size="sm" variant="light">
                      {selectedValues.size} selected
                    </Badge>
                  ) : (
                    options
                      .filter((o) => selectedValues.has(o.value))
                      .map((o) => (
                        <Badge key={o.value} size="sm" variant="light">
                          {o.label}
                        </Badge>
                      ))
                  )}
                </Group>
              </>
            )}
          </Group>
        </Button>
      </Popover.Target>

      <Popover.Dropdown w={220} p="xs">
        <Stack gap="xs">
          <TextInput size="xs" placeholder={title} />

          <ScrollArea h={200}>
            <Stack gap={4}>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <Checkbox
                    key={option.value}
                    size="xs"
                    checked={isSelected}
                    label={
                      <Group gap={6}>
                        {option.icon && <option.icon />}
                        <Text size="sm">{option.label}</Text>
                      </Group>
                    }
                    onChange={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }

                      const filterValues = Array.from(selectedValues);
                      onFilterChange({
                        [filterKey]: filterValues.length
                          ? filterValues
                          : undefined,
                      });
                    }}
                  />
                );
              })}
            </Stack>
          </ScrollArea>

          {selectedValues.size > 0 && (
            <>
              <Divider />
              <Button
                variant="subtle"
                size="xs"
                color="red"
                onClick={() => onFilterChange({ [filterKey]: undefined })}
              >
                Clear filters
              </Button>
            </>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
