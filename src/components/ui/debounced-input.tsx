import React, { useState } from "react";
import { TextInput, TextInputProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

type DebouncedInputProps = Omit<TextInputProps, "onChange" | "size"> & {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
};

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);
  const [debounced] = useDebouncedValue(value, debounce);

  // Update parent whenever debounced value changes
  React.useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  // Keep local value in sync with external value
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <TextInput
      {...props}
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
}
