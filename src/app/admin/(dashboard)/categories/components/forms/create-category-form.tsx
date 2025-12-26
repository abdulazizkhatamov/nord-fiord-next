"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, Button, Group, TextInput } from "@mantine/core";

import { postCategory, getCategories } from "../../api/api";
import { validateCreateCategoryForm } from "../../data/form-validation";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { toast } from "sonner";
import { DebouncedSelect } from "@/components/ui/debounced-select";

export default function CreateCategoryForm() {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: postCategory,
    onSuccess: async () => {
      toast.info("Категория успешно создана");
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Что-то пошло не так.");
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
      parentId: "",
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
        <DebouncedSelect
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
          error={form.errors.parentId}
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
