"use client";

import { useEffect, useState } from "react";
import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

export type Option = { label: string; value: string };

interface DebouncedMultiSelectProps
  extends Omit<
    MultiSelectProps,
    "data" | "value" | "onChange" | "searchable" | "nothingFoundMessage"
  > {
  value: string[];
  onChange: (values: string[]) => void;
  loadOptions: (query: string) => Promise<Option[]>;
}

export function DebouncedMultiSelect({
  value,
  onChange,
  loadOptions,
  placeholder,
  label,
  ...props
}: DebouncedMultiSelectProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchOptions() {
      setLoading(true);
      try {
        const result = await loadOptions(debouncedSearch);
        if (active) setOptions(result);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchOptions();
    return () => {
      active = false;
    };
  }, [debouncedSearch, loadOptions]);

  return (
    <MultiSelect
      data={options.map((o) => ({ value: o.value, label: o.label }))}
      value={value}
      onChange={onChange}
      searchable
      placeholder={placeholder}
      label={label}
      nothingFoundMessage={loading ? "Загрузка..." : "Ничего не найдено"}
      onSearchChange={setSearch}
      {...props} // pass all other MultiSelect props through
    />
  );
}
