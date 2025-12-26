import React from "react";
import UpdateCategoryForm from "../../components/forms/UpdateCategoryForm";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { getCategory } from "../../api/api";
import { Container, Title } from "@mantine/core";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategory(id),
  });
  return (
    <Container size="sm">
      <Title order={2} mb="md">
        Редактировать категорию
      </Title>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <UpdateCategoryForm category={{ id }} />
      </HydrationBoundary>
    </Container>
  );
}
