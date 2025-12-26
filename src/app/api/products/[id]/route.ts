import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/util/gen-slug";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
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

    if (!product)
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить товар." },
      { status: 500 }
    );
  }
}

const productUpdateSchema = z.object({
  name: z
    .string("Имя обязательно для указания.")
    .min(1, "Имя не может быть пустым.")
    .optional(),
  description: z.string("Требуется описание").optional(),
  availability: z.boolean("Укажите доступность продукта").optional(),
  categoryId: z.cuid("Категория обязательна").optional(),
  forms: z.array(z.cuid()).optional(),
  effects: z.array(z.cuid()).optional(),
  ingredients: z.array(z.cuid()).optional(),
  audiences: z.array(z.cuid()).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // 1️⃣ Validate body
    const parsed = productUpdateSchema.parse(body);

    // 2️⃣ Check product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Продукт не найден" }, { status: 404 });
    }

    // 3️⃣ Validate category if provided
    if (parsed.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: parsed.categoryId },
      });

      if (!categoryExists) {
        return NextResponse.json(
          { error: "Категория не найдена" },
          { status: 400 }
        );
      }
    }

    // 4️⃣ Build update data

    const data: Prisma.ProductUpdateInput = {
      ...(parsed.name !== undefined && { name: parsed.name }),
      ...(parsed.description !== undefined && {
        description: parsed.description,
      }),
      ...(parsed.availability !== undefined && {
        availability: parsed.availability,
      }),
      ...(parsed.categoryId !== undefined && {
        category: { connect: { id: parsed.categoryId } },
      }),

      ...(parsed.forms && {
        forms: {
          deleteMany: {},
          createMany: {
            data: parsed.forms.map((formId) => ({
              formId,
            })),
          },
        },
      }),

      ...(parsed.effects && {
        effects: {
          deleteMany: {},
          createMany: {
            data: parsed.effects.map((effectId) => ({
              effectId,
            })),
          },
        },
      }),

      ...(parsed.ingredients && {
        ingredients: {
          deleteMany: {},
          createMany: {
            data: parsed.ingredients.map((ingredientId) => ({
              ingredientId,
            })),
          },
        },
      }),

      ...(parsed.audiences && {
        audiences: {
          deleteMany: {},
          createMany: {
            data: parsed.audiences.map((audienceId) => ({
              audienceId,
            })),
          },
        },
      }),
    };

    // 5️⃣ Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        images: true,
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

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json(
      { error: "Не удалось обновить продукт" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: "Категория удалена" });
  } catch {
    return NextResponse.json(
      { error: "Не удалось удалить категорию" },
      { status: 500 }
    );
  }
}
