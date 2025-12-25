import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { paginationAndSortingSchema } from "@/util/api-schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// GET - Filters schema
const effectsFilterSchema = z.object({
  name: z.string().optional(),
});

// Merge schemas
const effectsQuerySchema = paginationAndSortingSchema.extend(
  effectsFilterSchema.shape
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    // Validate query params
    const query = effectsQuerySchema.parse(searchParams);

    const { pageIndex, pageSize, sortField, sortOrder, name } = query;

    // Define sortable fields
    const sortableFields = ["name"] as const;
    type SortableField = (typeof sortableFields)[number];

    const orderBy =
      sortField && sortableFields.includes(sortField as SortableField)
        ? { [sortField]: sortOrder ?? "asc" }
        : undefined;

    // Build dynamic filters
    const where: Prisma.EffectWhereInput = {
      ...(name && { name: { contains: name, mode: "insensitive" } }),
    };

    // Count total rows
    const rowCount = await prisma.effect.count({ where });

    // Fetch paginated result
    const result = await prisma.effect.findMany({
      where,
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy,
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
