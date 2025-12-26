import z from "zod";
import { Filters } from "@/types/api-types";

export const categorySchema = z.object({
  id: z.cuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.cuid().nullable(),
});

export type CategoryType = z.infer<typeof categorySchema>;
export type CategoryFilterType = Filters<CategoryType>;
