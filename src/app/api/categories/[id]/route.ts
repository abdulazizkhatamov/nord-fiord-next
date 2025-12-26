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
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!category)
      return NextResponse.json(
        { error: "Категория не найдена" },
        { status: 404 }
      );

    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить категорию" },
      { status: 500 }
    );
  }
}

const categoryUpdateSchema = z.object({
  name: z.string().min(1, "Имя не может быть пустым.").optional(),
  parentId: z.string().or(z.literal("")).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // 1️⃣ Validate body
    const { name, parentId: rawParentId } = categoryUpdateSchema.parse(body);

    const parentId = rawParentId === "" ? null : rawParentId;

    // 2️⃣ Find existing category
    const dbCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!dbCategory) {
      return NextResponse.json(
        { error: "Категория не найдена" },
        { status: 400 }
      );
    }

    // 3️⃣ Validate parent
    if (parentId === id) {
      return NextResponse.json(
        { error: "Категория не может быть своим собственным родителем." },
        { status: 400 }
      );
    }

    if (parentId) {
      const parentExists = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentExists) {
        return NextResponse.json(
          { error: "Родительская категория не найдена" },
          { status: 400 }
        );
      }
    }

    // 4️⃣ Build update data (NestJS-style)
    const data: Prisma.CategoryUncheckedUpdateInput = {
      ...(name !== undefined && { name }),
      ...(parentId !== undefined && { parentId }),
    };

    // 5️⃣ Regenerate slug if name changed
    if (name !== undefined && name !== dbCategory.name) {
      data.slug = await generateUniqueSlug(prisma, "category", name);
    }

    // 6️⃣ Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json(
      { error: "Не удалось отредактировать категорию" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
