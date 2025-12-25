// app/products/create/page.tsx
import { Container, Title } from "@mantine/core";
import CreateProductForm from "../components/forms/create-product-form";

export default async function Page() {
  return (
    <Container size="sm">
      <Title order={2} mb="md">
        Создать продукт
      </Title>

      <CreateProductForm />
    </Container>
  );
}
