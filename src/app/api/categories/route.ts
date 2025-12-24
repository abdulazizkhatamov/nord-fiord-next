import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { paginationAndSortingSchema } from "@/util/api-schema";
import { generateUniqueSlug } from "@/util/gen-slug";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// GET - Filters schema
const categoryFilterSchema = z.object({
  name: z.string().optional(),
});

// POST - Create schema
const categoryCreateSchema = z.object({
  name: z.string("Name is required").min(1, "Name cannot be empty"),
  parentId: z.string().optional().nullable(), // optional parentId
});

// Merge schemas
const categoriesQuerySchema = paginationAndSortingSchema.extend(
  categoryFilterSchema.shape
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    // Validate query params
    const query = categoriesQuerySchema.parse(searchParams);

    const { pageIndex, pageSize, sortField, sortOrder, name } = query;

    // Define sortable fields
    const sortableFields = ["name", "createdAt"] as const;
    type SortableField = (typeof sortableFields)[number];

    const orderBy =
      sortField && sortableFields.includes(sortField as SortableField)
        ? { [sortField]: sortOrder ?? "asc" }
        : undefined;

    // Build dynamic filters
    const where: Prisma.CategoryWhereInput = {
      ...(name && { name: { contains: name, mode: "insensitive" } }),
    };

    // Count total rows
    const rowCount = await prisma.category.count({ where });

    // Fetch paginated result
    const result = await prisma.category.findMany({
      where,
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy,
      include: {
        parent: true,
        children: true,
      },
    });

    return NextResponse.json({ result, rowCount });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { name, parentId } = categoryCreateSchema.parse(body);

    // Optional: verify parent exists
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parentCategory) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 400 }
        );
      }
    }

    // Generate a unique slug
    const slug = await generateUniqueSlug(prisma, "category", name);

    // Create category
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        parentId: parentId || null,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
