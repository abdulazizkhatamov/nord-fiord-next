"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { Alert, Box, Button, Group, TextInput } from "@mantine/core";

import { postCategory, getCategories } from "../../api/api";
import { validateCreateCategoryForm } from "../../data/form-validation";
import { DebouncedCombobox } from "@/components/ui/debounced-combobox";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { toast } from "sonner";

export default function CreateCategoryForm() {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: postCategory,
    onSuccess: () => {
      toast.info("Категория успешно создана");
    },
    onError: () => {
      toast.error("Что-то пошло не так.");
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
      parentId: null as string | null,
    },
    validate: zod4Resolver(validateCreateCategoryForm),
    validateInputOnBlur: true,
  });

  const handleSubmit = () => {
    if (!form.validate().hasErrors) {
      mutate(form.values);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {isError && (
        <Alert color="red" variant="filled" title="Ошибка" mb="md">
          {error?.message ?? "Что-то пошло не так"}
        </Alert>
      )}

      <TextInput
        withAsterisk
        label="Название категории"
        placeholder="Введите название категории"
        {...form.getInputProps("name")}
      />

      <Box mt={"md"}>
        <DebouncedCombobox
          label="Родительская категория"
          placeholder="Поиск категории"
          value={form.values.parentId}
          onChange={(value) => form.setFieldValue("parentId", value)}
          loadOptions={async (query) => {
            const data = await getCategories({ name: query });
            return data.result.map((category) => ({
              label: category.name,
              value: category.id,
            }));
          }}
        />
      </Box>

      <Group mt="xl">
        <Button type="submit" loading={isPending}>
          Создать категорию
        </Button>
      </Group>
    </form>
  );
}
