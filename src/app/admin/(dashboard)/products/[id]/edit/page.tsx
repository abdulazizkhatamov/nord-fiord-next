import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { Container, Title } from "@mantine/core";
import { getProduct } from "../../api/api";
import UpdateProductForm from "../../components/forms/UpdateCategoryForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
  });
  return (
    <Container size="sm">
      <Title order={2} mb="md">
        Редактировать товар
      </Title>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <UpdateProductForm product={{ id }} />
      </HydrationBoundary>
    </Container>
  );
}
