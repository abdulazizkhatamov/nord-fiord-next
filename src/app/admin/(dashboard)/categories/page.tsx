"use client";

import React, { Suspense } from "react";
import CategoriesTableWrapper from "./components/table/TableWrapper";
import { Box, LoadingOverlay } from "@mantine/core";

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
      <CategoriesTableWrapper />
    </Suspense>
  );
}
