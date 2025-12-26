import z from "zod";
import { Filters } from "@/types/api-types";
import { formSchema } from "../../forms/data/form";
import { effectSchema } from "../../effects/data/effect";
import { ingredientSchema } from "../../ingredients/data/ingredient";
import { audienceSchema } from "../../audiences/data/audience";
import { categorySchema } from "../../categories/data/categorySchema";

// New ProductImage schema
export const productImageSchema = z.object({
  id: z.cuid(),
  url: z.url(),
  altText: z.string().optional(),
  isPrimary: z.boolean(),
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const productSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  availability: z.boolean(),
  categoryId: z.cuid(),
  category: categorySchema,
  images: z.array(productImageSchema), // added images
  forms: z.array(z.object({ form: formSchema })),
  effects: z.array(z.object({ effect: effectSchema })),
  ingredients: z.array(z.object({ ingredient: ingredientSchema })),
  audiences: z.array(z.object({ audience: audienceSchema })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ProductType = z.infer<typeof productSchema>;
export type ProductFilterType = Filters<ProductType>;
