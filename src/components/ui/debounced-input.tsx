import { useEffect, useState, ChangeEvent } from "react";
import { TextInput, TextInputProps } from "@mantine/core";

type DebouncedInputProps = Omit<TextInputProps, "onChange" | "size"> & {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
};

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 200,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState<string>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <TextInput
      {...props}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value === "") {
          setValue("");
          return;
        }
        setValue(e.currentTarget.value);
      }}
    />
  );
}
