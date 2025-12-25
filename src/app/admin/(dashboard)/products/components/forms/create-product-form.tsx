"use client";

import { useForm } from "@mantine/form";
import { TextInput, Button, Stack, Switch } from "@mantine/core";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { createProductSchema } from "../../data/form-validation";
import { RichText } from "@/components/editor/editor";
import { getCategories } from "../../../categories/api/api";
import { getForms } from "../../../forms/api/api";
import { DebouncedMultiSelect } from "@/components/ui/debounced-multiselect";
import { getEffects } from "../../../effects/api/api";
import { getIngredients } from "../../../ingredients/api/api";
import { getAudiences } from "../../../audiences/api/api";
import { DebouncedSelect } from "@/components/ui/debounced-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postProduct } from "../../api/api";
import { toast } from "sonner";

export default function CreateProductForm() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({ mutationFn: postProduct });
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      categoryId: "",
      forms: [] as string[],
      effects: [] as string[],
      ingredients: [] as string[],
      audiences: [] as string[],
      availability: false,
    },
    validate: zod4Resolver(createProductSchema),
  });

  const handleSubmit = (values: typeof form.values) => {
    mutate(values, {
      onSuccess: async () => {
        toast.info("Продукт успешно создан");
        await queryClient.invalidateQueries({ queryKey: ["products"] });
      },
      onError: () => {
        toast.error("Что-то пошло не так.");
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Название продукта"
          placeholder="Витамин C"
          {...form.getInputProps("name")}
        />
        <RichText
          value={form.values.description}
          onChange={(html) => form.setFieldValue("description", html)}
        />
        {form.errors.description && (
          <div style={{ color: "red", fontSize: 12 }}>
            {form.errors.description}
          </div>
        )}

        <DebouncedSelect
          label="Категория"
          placeholder="Поиск категории"
          value={form.values.categoryId}
          onChange={(val) => form.setFieldValue("categoryId", val)}
          loadOptions={async (query) => {
            const data = await getCategories({ name: query });
            return data.result.map((c) => ({ label: c.name, value: c.id }));
          }}
          error={form.errors.categoryId}
        />

        <DebouncedMultiSelect
          label="Формы"
          placeholder="Поиск форм"
          value={form.values.forms}
          onChange={(vals) => form.setFieldValue("forms", vals)}
          loadOptions={async (query) => {
            const data = await getForms({ name: query });
            return data.result.map((f) => ({ label: f.name, value: f.id }));
          }}
        />

        <DebouncedMultiSelect
          label="Эффекты"
          placeholder="Поиск эффектов"
          value={form.values.effects}
          onChange={(vals) => form.setFieldValue("effects", vals)}
          loadOptions={async (query) => {
            const data = await getEffects({ name: query });
            return data.result.map((e) => ({ label: e.name, value: e.id }));
          }}
        />

        <DebouncedMultiSelect
          label="Ингредиенты"
          placeholder="Поиск ингредиентов"
          value={form.values.ingredients}
          onChange={(vals) => form.setFieldValue("ingredients", vals)}
          loadOptions={async (query) => {
            const data = await getIngredients({ name: query });
            return data.result.map((i) => ({ label: i.name, value: i.id }));
          }}
        />

        <DebouncedMultiSelect
          label="Аудитории"
          placeholder="Поиск аудиторий"
          value={form.values.audiences}
          onChange={(vals) => form.setFieldValue("audiences", vals)}
          loadOptions={async (query) => {
            const data = await getAudiences({ name: query });
            return data.result.map((a) => ({ label: a.name, value: a.id }));
          }}
        />

        <Switch
          label="Доступность"
          checked={form.values.availability}
          onChange={(event) =>
            form.setFieldValue("availability", event.currentTarget.checked)
          }
        />

        <Button type="submit" loading={isPending}>
          Создать продукт
        </Button>
      </Stack>
    </form>
  );
}
