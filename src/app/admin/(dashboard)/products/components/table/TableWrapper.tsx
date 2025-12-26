"use client";
import React from "react";
import { sortByToState, stateToSortBy } from "@/util/table-sort";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/const/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useFilters } from "@/hooks/use-filters";
import { ProductFilterType } from "../../data/product";
import { getProducts } from "../../api/api";
import { productColumns } from "./Columns";
import { ProductsTable } from "./Table";

export default function ProductsTableWrapper() {
  const { filters, setFilters } = useFilters<ProductFilterType>();

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    placeholderData: keepPreviousData,
  });

  const paginationState = {
    pageIndex: Number(filters.pageIndex ?? DEFAULT_PAGE_INDEX),
    pageSize: Number(filters.pageSize ?? DEFAULT_PAGE_SIZE),
  };

  const sortingState = sortByToState(filters.sortBy);
  const columns = React.useMemo(() => productColumns, []);

  return (
    <ProductsTable
      data={data?.result ?? []}
      columns={columns}
      pagination={paginationState}
      paginationOptions={{
        onPaginationChange: (pagination) =>
          setFilters(
            typeof pagination === "function"
              ? pagination(paginationState)
              : pagination
          ),
        rowCount: data?.rowCount,
      }}
      filters={filters}
      onFilterChange={(f) => setFilters(f)}
      sorting={sortingState}
      onSortingChange={(updaterOrValue) => {
        const next =
          typeof updaterOrValue === "function"
            ? updaterOrValue(sortingState)
            : updaterOrValue;
        setFilters({ sortBy: stateToSortBy(next) });
      }}
      isLoading={isLoading}
    />
  );
}
