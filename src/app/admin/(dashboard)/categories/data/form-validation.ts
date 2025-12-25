import { z } from "zod";

export const validateCreateCategoryForm = z.object({
  name: z
    .string({
      error: "Название категории обязательно для указания",
    })
    .min(1, "Название категории не может быть пустым")
    .max(100, "Название категории слишком длинное"),

  parentId: z.cuid("Некорректный ID родительской категории").nullable(),
});

export const validateUpdateCategoryForm = z.object({
  name: z
    .string()
    .min(1, "Название категории не может быть пустым")
    .max(100, "Название категории слишком длинное")
    .optional(),
  parentId: z.string().nullable().optional(),
});
