"use client";
import { useForm } from "@mantine/form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Alert, Box, Button, Group, TextInput } from "@mantine/core";
import { zod4Resolver } from "mantine-form-zod-resolver";

import { putCategory, getCategories, getCategory } from "../../api/api";
import { validateUpdateCategoryForm } from "../../data/formValidation";
import { toast } from "sonner";
import { DebouncedSelect } from "@/components/ui/debounced-select";

interface UpdateCategoryFormProps {
  category: {
    id: string;
  };
}

type UpdateCategoryPayload = {
  name?: string;
  parentId?: string | null;
};

export default function UpdateCategoryForm({
  category,
}: UpdateCategoryFormProps) {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({
    queryKey: ["categories", category.id],
    queryFn: () => getCategory(category.id),
  });
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: putCategory,
    onSuccess: async () => {
      toast.info("Категория успешно отредактирована");
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Что-то пошло не так.");
    },
  });

  const form = useForm({
    initialValues: {
      name: data.name,
      parentId: data.parentId ?? "",
    },
    validate: zod4Resolver(validateUpdateCategoryForm),
    validateInputOnBlur: true,
  });

  const handleSubmit = () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    // 🔹 Only send changed fields
    const payload: UpdateCategoryPayload = {};

    if (form.values.name !== data.name) {
      payload.name = form.values.name;
    }

    if (form.values.parentId !== data.parentId) {
      payload.parentId = form.values.parentId;
    }

    mutate({
      id: category.id,
      ...payload,
    });
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
        label="Название категории"
        placeholder="Введите название категории"
        {...form.getInputProps("name")}
      />

      <Box mt="md">
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
          Сохранить изменения
        </Button>
      </Group>
    </form>
  );
}
