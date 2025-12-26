"use client";

import { Suspense } from "react";
import { Box, LoadingOverlay } from "@mantine/core";
import ProductsTableWrapper from "./components/table/TableWrapper";

export default function Page() {
  return (
    <Suspense
      fallback={
        <Box pos="relative">
          <LoadingOverlay
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        </Box>
      }
    >
      <ProductsTableWrapper />
    </Suspense>
  );
}
