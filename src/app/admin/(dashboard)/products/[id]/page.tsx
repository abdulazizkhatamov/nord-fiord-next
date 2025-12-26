import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { Container, Title, Paper } from "@mantine/core";
import { getProduct } from "../api/api";
import { ProductDetails } from "../components/product-details";

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
    <Container size="xl" py="xl">
      <Paper shadow="xs" p="xl" radius="md">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductDetails productId={id} />
        </HydrationBoundary>
      </Paper>
    </Container>
  );
}
