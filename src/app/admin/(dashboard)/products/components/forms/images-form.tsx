"use client";

import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import {
  Card,
  Title,
  FileInput,
  Button,
  ScrollArea,
  SimpleGrid,
  Image,
  Stack,
} from "@mantine/core";
import axiosInstance from "@/config/axios";

interface ImageType {
  id: string;
  url: string;
  altText?: string | null;
}

interface ImagesFormProps {
  productId: string;
  initialImages: ImageType[];
}

// Zod schema for file validation
const fileSchema = z
  .instanceof(File)
  .refine((file) => file.type.startsWith("image/"), "File must be an image")
  .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB");

export const ImagesForm: React.FC<ImagesFormProps> = ({
  productId,
  initialImages,
}) => {
  const queryClient = useQueryClient();
  const [images, setImages] = useState<ImageType[]>(initialImages);

  const form = useForm<{ file: File | null }>({
    initialValues: { file: null },
    validate: {
      file: (value) => {
        if (!value) return "Please select a file";
        const result = fileSchema.safeParse(value);
        return result.success ? null : result.error.message;
      },
    },
  });

  // Upload mutation via your server API
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      // Call server API to handle upload to Vercel Blob
      const res = await fetch(`/api/products/${productId}/images`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      // Server returns the saved ImageType with URL
      const newImage: ImageType = await res.json();
      return newImage;
    },
    onSuccess: (newImage) => {
      setImages((prev) => [...prev, newImage]);
      form.setFieldValue("file", null);
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (imageId: string) => {
      await axiosInstance.delete(`/api/products/${productId}/images`, {
        data: { imageId },
      });
      return imageId;
    },
    onSuccess: (deletedId) => {
      setImages((prev) => prev.filter((img) => img.id !== deletedId));
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
  });

  const handleUpload = () => {
    const file = form.values.file;
    if (file) uploadMutation.mutate(file);
  };

  return (
    <Card shadow="sm" p="sm">
      <Title order={4} mb="sm">
        Изображения
      </Title>

      {/* Upload */}
      <Stack>
        <FileInput
          placeholder="Загрузить новое изображение"
          {...form.getInputProps("file")}
          error={form.errors.file}
        />
        <Button
          onClick={handleUpload}
          disabled={!form.values.file || uploadMutation.isPending}
        >
          {uploadMutation.isPending ? "Загрузка..." : "Загрузить"}
        </Button>
      </Stack>

      {/* Existing Images */}
      <ScrollArea style={{ maxHeight: 300 }} mt="sm">
        <SimpleGrid cols={2} spacing="sm">
          {images.map((img) => (
            <Card key={img.id} p="xs" shadow="xs">
              <Image
                src={img.url}
                alt={img.altText || "product"}
                height={100}
                fit="contain"
              />
              <Button
                color="red"
                size="xs"
                fullWidth
                mt="xs"
                onClick={() => deleteMutation.mutate(img.id)}
              >
                Удалить
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      </ScrollArea>
    </Card>
  );
};
