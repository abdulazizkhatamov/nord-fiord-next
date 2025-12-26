"use client";

import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { Carousel } from "@mantine/carousel";
import {
  Card,
  Title,
  FileInput,
  Button,
  Image,
  Stack,
  Modal,
  Checkbox,
  NumberInput,
  Group,
} from "@mantine/core";

interface ImageType {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  order: number;
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
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Delete modal state
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageType | null>(null);

  const fileForm = useForm<{ file: File | null }>({
    initialValues: { file: null },
    validate: {
      file: (value) => {
        if (!value) return "Please select a file";
        const result = fileSchema.safeParse(value);
        return result.success ? null : result.error.message;
      },
    },
  });

  const modalForm = useForm<{ isPrimary: boolean; order: number }>({
    initialValues: { isPrimary: false, order: 0 },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      isPrimary,
      order,
    }: {
      file: File;
      isPrimary: boolean;
      order: number;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("isPrimary", isPrimary.toString());
      formData.append("order", order.toString());

      const res = await fetch(`/api/products/${productId}/images`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const newImage: ImageType = await res.json();
      return newImage;
    },
    onSuccess: (newImage) => {
      setImages((prev) => [...prev, newImage]);
      setSelectedFile(null);
      setModalOpened(false);
      fileForm.setFieldValue("file", null);
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (imageId: string) => {
      await fetch(`/api/products/${productId}/images`, {
        method: "DELETE",
        body: JSON.stringify({ imageId }),
        headers: { "Content-Type": "application/json" },
      });
      return imageId;
    },
    onSuccess: (deletedId) => {
      setImages((prev) => prev.filter((img) => img.id !== deletedId));
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
  });

  const handleOpenModal = () => {
    const file = fileForm.values.file;
    if (file) {
      setSelectedFile(file);
      setModalOpened(true);
    }
  };

  const handleUploadWithData = () => {
    if (selectedFile) {
      const { isPrimary, order } = modalForm.values;
      uploadMutation.mutate({ file: selectedFile, isPrimary, order });
    }
  };

  // Delete modal handlers
  const handleOpenDeleteModal = (img: ImageType) => {
    setImageToDelete(img);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = () => {
    if (imageToDelete) {
      deleteMutation.mutate(imageToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpened(false);
          setImageToDelete(null);
        },
      });
    }
  };

  return (
    <>
      <Card shadow="sm" p="sm">
        <Title order={4} mb="sm">
          Изображения
        </Title>

        {/* File Upload */}
        <Stack>
          <FileInput
            placeholder="Загрузить новое изображение"
            {...fileForm.getInputProps("file")}
            error={fileForm.errors.file}
          />
          <Button onClick={handleOpenModal} disabled={!fileForm.values.file}>
            Загрузить
          </Button>
        </Stack>

        {/* Existing Images in Carousel */}
        <Carousel height={300} mt="sm">
          {images.map((img) => (
            <Carousel.Slide key={img.id}>
              <Card p="xs" shadow="xs">
                <Image
                  src={img.url}
                  alt={img.altText || "product"}
                  height={250}
                  fit="contain"
                />
                <Button
                  color="red"
                  size="xs"
                  fullWidth
                  mt="xs"
                  onClick={() => handleOpenDeleteModal(img)}
                >
                  Удалить
                </Button>
              </Card>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Card>

      {/* Modal for additional data on upload */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Дополнительные данные изображения"
        centered
      >
        <Stack>
          <Checkbox
            label="Primary"
            {...modalForm.getInputProps("isPrimary", { type: "checkbox" })}
          />
          <NumberInput label="Order" {...modalForm.getInputProps("order")} />
          <Group mt="md">
            <Button
              onClick={handleUploadWithData}
              loading={uploadMutation.isPending}
            >
              Сохранить
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Подтвердите удаление изображения"
        centered
      >
        {imageToDelete && (
          <Stack>
            <Image
              src={imageToDelete.url}
              alt={imageToDelete.altText || "product"}
              height={200}
              fit="contain"
            />
            <div>
              <strong>Является основным:</strong>{" "}
              {imageToDelete.isPrimary ? "Да" : "Нет"}
            </div>
            <div>
              <strong>Порядок:</strong> {imageToDelete.order}
            </div>
            <Group mt="md">
              <Button
                color="red"
                onClick={handleConfirmDelete}
                loading={deleteMutation.isPending}
              >
                Удалить
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpened(false)}
              >
                Отмена
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
};
