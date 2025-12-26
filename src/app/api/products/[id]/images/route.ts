import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;

  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file");
    const isPrimary = formData.get("isPrimary");
    const order = formData.get("order");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
    }

    // Convert order to number and isPrimary to boolean
    const orderNumber = order ? parseInt(order.toString(), 10) : 0;
    const isPrimaryBool = isPrimary === "true";

    // If new image is primary, unset existing primary images
    if (isPrimaryBool) {
      await prisma.productImage.updateMany({
        where: { productId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file.stream(), {
      access: "public",
      addRandomSuffix: true,
    });

    // Save URL and additional info in database
    const image = await prisma.productImage.create({
      data: {
        url: blob.url,
        altText: file.name,
        productId,
        order: orderNumber,
        isPrimary: isPrimaryBool,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить изображение" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;

  try {
    const body = await req.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: "Не указан ID изображения" },
        { status: 400 }
      );
    }

    // Find image in DB
    const existingImage = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!existingImage || existingImage.productId !== productId) {
      return NextResponse.json(
        { error: "Изображение не найдено или не принадлежит продукту" },
        { status: 404 }
      );
    }

    // Extract the blob path from URL
    // Example: "https://<your-domain>.vercel-storage.com/folder/filename.png"
    const url = new URL(existingImage.url);
    const path = url.pathname.substring(1); // remove leading '/'

    // Delete from Vercel Blob
    await del(path);

    // Delete from database
    await prisma.productImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true, deletedId: imageId });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Не удалось удалить изображение" },
      { status: 500 }
    );
  }
}
