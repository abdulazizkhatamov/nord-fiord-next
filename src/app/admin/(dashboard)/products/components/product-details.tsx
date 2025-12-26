"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getProduct } from "../api/api";
import {
  Stack,
  Title,
  Text,
  Badge,
  Card,
  Grid,
  Group,
  Box,
} from "@mantine/core";
import parse from "html-react-parser";
import { ImagesForm } from "./forms/images-form";

interface ProductDetailsProps {
  productId: string;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  productId,
}) => {
  const { data: product } = useSuspenseQuery({
    queryKey: ["products", productId],
    queryFn: () => getProduct(productId),
  });

  return (
    <Stack gap="xl">
      {/* Заголовок */}
      <Stack gap="sm">
        <Title order={3}>{product.name}</Title>
        <Box style={{ marginBottom: 4 }}>
          {parse(product.description)} {/* TipTap HTML отображение */}
        </Box>
        <Badge color={product.availability ? "green" : "red"}>
          {product.availability ? "В наличии" : "Нет в наличии"}
        </Badge>
      </Stack>

      <Card shadow="xs" p="md">
        <Text fw={500} mb="xs">
          Категория:
        </Text>
        <Text>{product.category?.name}</Text>
      </Card>

      {/* Изображения и загрузка */}
      <Grid gutter="md">
        <Grid.Col span={6}>
          <ImagesForm productId={productId} initialImages={product.images} />
        </Grid.Col>

        {/* Атрибуты товара */}
        <Grid.Col span={6}>
          <Stack gap="sm">
            <Card shadow="sm" p="sm">
              <Title order={5}>Формы</Title>
              <Group mt="xs" gap="xs" align="center">
                {product.forms.map((f) => (
                  <Badge key={f.form.id} color="blue" variant="light">
                    {f.form.name}
                  </Badge>
                ))}
              </Group>
            </Card>

            <Card shadow="sm" p="sm">
              <Title order={5}>Эффекты</Title>
              <Group mt="xs" gap="xs" align="center">
                {product.effects.map((e) => (
                  <Badge key={e.effect.id} color="teal" variant="light">
                    {e.effect.name}
                  </Badge>
                ))}
              </Group>
            </Card>

            <Card shadow="sm" p="sm">
              <Title order={5}>Ингредиенты</Title>
              <Group mt="xs" gap="xs" align="center">
                {product.ingredients.map((i) => (
                  <Badge key={i.ingredient.id} color="orange" variant="light">
                    {i.ingredient.name}
                  </Badge>
                ))}
              </Group>
            </Card>

            <Card shadow="sm" p="sm">
              <Title order={5}>Аудитории</Title>
              <Group mt="xs" gap="xs" align="center">
                {product.audiences.map((a) => (
                  <Badge key={a.audience.id} color="grape" variant="light">
                    {a.audience.name}
                  </Badge>
                ))}
              </Group>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
