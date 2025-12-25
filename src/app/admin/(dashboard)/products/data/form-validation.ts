import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Название продукта обязательно"),
  description: z.string().min(1, "Описание обязательно"),
  categoryId: z.string().min(1, "Выберите категорию"),
  forms: z.array(z.string()),
  effects: z.array(z.string()),
  ingredients: z.array(z.string()),
  audiences: z.array(z.string()),
  availability: z.boolean("Укажите доступность продукта"),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Название продукта обязательно").optional(),
  description: z.string().min(1, "Описание обязательно").optional(),
  categoryId: z.string().min(1, "Выберите категорию").optional(),
  forms: z.array(z.string()).optional(),
  effects: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  audiences: z.array(z.string()).optional(),
  availability: z.boolean("Укажите доступность продукта").optional(),
});
