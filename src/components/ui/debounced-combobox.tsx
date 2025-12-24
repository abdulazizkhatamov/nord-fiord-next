import { useEffect, useState } from "react";
import { Combobox, PillsInput, Pill, useCombobox } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

export type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  loadOptions: (query: string) => Promise<Option[]>;
  placeholder?: string;
  label?: string;
};

export function DebouncedCombobox({
  value,
  onChange,
  loadOptions,
  placeholder,
  label,
}: Props) {
  const combobox = useCombobox();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    let active = true;

    async function fetchOptions() {
      setLoading(true);
      const result = await loadOptions(debouncedSearch);
      if (active) setOptions(result);
      setLoading(false);
    }

    fetchOptions();
    return () => {
      active = false;
    };
  }, [debouncedSearch, loadOptions]);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        onChange(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <PillsInput label={label} onClick={() => combobox.openDropdown()}>
          <Pill.Group>
            {selectedOption && (
              <Pill withRemoveButton onRemove={() => onChange(null)}>
                {selectedOption.label}
              </Pill>
            )}

            <PillsInput.Field
              value={search}
              placeholder={placeholder}
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                combobox.openDropdown();
              }}
              onFocus={() => combobox.openDropdown()}
            />
          </Pill.Group>
        </PillsInput>
      </Combobox.Target>

      <Combobox.Dropdown mah={250} style={{ overflowY: "auto" }}>
        <Combobox.Options>
          {loading && <Combobox.Empty>Загрузка...</Combobox.Empty>}

          {!loading && options.length === 0 && (
            <Combobox.Empty>Ничего не найдено</Combobox.Empty>
          )}

          {options.map((opt) => (
            <Combobox.Option value={opt.value} key={opt.value}>
              {opt.label}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
