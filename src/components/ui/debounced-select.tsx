"use client";

import { useEffect, useState } from "react";
import { Select, SelectProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

export type Option = { label: string; value: string };

interface DebouncedSelectProps
  extends Omit<
    SelectProps,
    "data" | "value" | "onChange" | "searchable" | "nothingFoundMessage"
  > {
  value: string;
  onChange: (value: string) => void;
  loadOptions: (query: string) => Promise<Option[]>;
}

export function DebouncedSelect({
  value,
  onChange,
  loadOptions,
  placeholder,
  label,
  ...props
}: DebouncedSelectProps) {
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
    <Select
      data={options.map((o) => ({ value: o.value, label: o.label }))}
      value={value}
      onChange={(val) => {
        // Mantine Select passes string | null
        onChange(val ?? "");
      }}
      searchable
      placeholder={placeholder}
      label={label}
      nothingFoundMessage={loading ? "Загрузка..." : "Ничего не найдено"}
      onSearchChange={setSearch}
      {...props} // forward any other props
    />
  );
}
