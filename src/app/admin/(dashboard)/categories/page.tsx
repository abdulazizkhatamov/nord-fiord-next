"use client";
import React from "react";
import { CategoriesTable } from "./components/table/table";
import { sortByToState, stateToSortBy } from "@/util/table-sort";
import { categoryColumns } from "./components/table/columns";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/const/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useFilters } from "@/hooks/use-filters";
import { CategoryFilterType } from "./data/category";
import { getCategories } from "./api/api";

export default function Page() {
  const { filters, setFilters } = useFilters<CategoryFilterType>();

  const { data, isLoading } = useQuery({
    queryKey: ["categories", filters],
    queryFn: () => getCategories(filters),
    placeholderData: keepPreviousData,
    staleTime: 500000,
  });

  const paginationState = {
    pageIndex: Number(filters.pageIndex ?? DEFAULT_PAGE_INDEX),
    pageSize: Number(filters.pageSize ?? DEFAULT_PAGE_SIZE),
  };

  const sortingState = sortByToState(filters.sortBy);
  const columns = React.useMemo(() => categoryColumns, []);

  return (
    <CategoriesTable
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
