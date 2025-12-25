import z from "zod";
import { Filters } from "@/types/api-types";

export const ingredientSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1),
});

export type IngredientType = z.infer<typeof ingredientSchema>;
export type IngredientFilterType = Filters<IngredientType>;
