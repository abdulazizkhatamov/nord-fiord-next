import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;

  // Disable Next.js built-in body parsing to get the raw request
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
  }

  // Upload to Vercel Blob
  const blob = await put(file.name, file.stream(), {
    access: "public",
  });

  // Save URL in database
  const image = await prisma.productImage.create({
    data: {
      url: blob.url,
      altText: file.name,
      productId,
    },
  });

  return NextResponse.json(image);
}
