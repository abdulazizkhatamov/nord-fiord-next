import React from "react";
import CreateCategoryForm from "../components/forms/create-category-form";
import { Container, Title } from "@mantine/core";

export default function Page() {
  return (
    <Container size="sm">
      <Title order={2} mb="md">
        Создание категории
      </Title>

      <CreateCategoryForm />
    </Container>
  );
}
