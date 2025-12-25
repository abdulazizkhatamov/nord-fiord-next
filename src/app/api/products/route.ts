import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { paginationAndSortingSchema } from "@/util/api-schema";
import { generateUniqueSlug } from "@/util/gen-slug";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// GET - Filters schema
const productFilterSchema = z.object({
  name: z.string().optional(),
  availability: z.boolean().optional(),
});

// POST - Create schema
// POST - Create product schema
const productCreateSchema = z.object({
  name: z
    .string("Имя обязательно для указания.")
    .min(1, "Имя не может быть пустым."),
  description: z.string("Требуется описание"),
  availability: z.boolean("Укажите доступность продукта"),
  categoryId: z.cuid("Категория обязательна"),
  forms: z.array(z.cuid()).optional().default([]),
  effects: z.array(z.cuid()).optional().default([]),
  ingredients: z.array(z.cuid()).optional().default([]),
  audiences: z.array(z.cuid()).optional().default([]),
});

// Merge schemas
const productsQuerySchema = paginationAndSortingSchema.extend(
  productFilterSchema.shape
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    // Validate query params
    const query = productsQuerySchema.parse(searchParams);

    const { pageIndex, pageSize, sortField, sortOrder, name, availability } =
      query;

    // Define sortable fields
    const sortableFields = ["name", "availability", "createdAt"] as const;
    type SortableField = (typeof sortableFields)[number];

    const orderBy =
      sortField && sortableFields.includes(sortField as SortableField)
        ? { [sortField]: sortOrder ?? "asc" }
        : undefined;

    // Build dynamic filters
    const where: Prisma.ProductWhereInput = {
      ...(name && { name: { contains: name, mode: "insensitive" } }),
      ...(availability !== undefined && { availability }),
    };

    // Count total rows
    const rowCount = await prisma.product.count({ where });

    // Fetch paginated result
    const result = await prisma.product.findMany({
      where,
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy,
      include: {
        category: true,
        forms: {
          include: { form: true },
        },
        effects: {
          include: { effect: true },
        },
        ingredients: {
          include: { ingredient: true },
        },
        audiences: {
          include: { audience: true },
        },
      },
    });

    return NextResponse.json({ result, rowCount });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const {
      name,
      description,
      availability,
      categoryId,
      forms,
      effects,
      ingredients,
      audiences,
    } = productCreateSchema.parse(body);

    // Optional: verify category exists
    if (categoryId) {
      const productCategory = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!productCategory) {
        return NextResponse.json(
          { error: "Категория товара не найдена" },
          { status: 400 }
        );
      }
    }

    // Generate a unique slug
    const slug = await generateUniqueSlug(prisma, "product", name);

    // Create category
    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        availability,
        categoryId,

        forms: {
          createMany: {
            data: forms.map((formId: string) => ({
              formId,
            })),
          },
        },

        effects: {
          createMany: {
            data: effects.map((effectId: string) => ({
              effectId,
            })),
          },
        },

        ingredients: {
          createMany: {
            data: ingredients.map((ingredientId: string) => ({
              ingredientId,
            })),
          },
        },

        audiences: {
          createMany: {
            data: audiences.map((audienceId: string) => ({
              audienceId,
            })),
          },
        },
      },
      include: {
        category: true,
        forms: {
          include: { form: true },
        },
        effects: {
          include: { effect: true },
        },
        ingredients: {
          include: { ingredient: true },
        },
        audiences: {
          include: { audience: true },
        },
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
