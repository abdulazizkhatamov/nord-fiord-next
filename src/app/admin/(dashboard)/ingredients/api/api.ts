import { PaginatedData } from "@/types/api-types";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/const/pagination";
import axiosInstance from "@/config/axios";
import { IngredientFilterType, IngredientType } from "../data/ingredient";

/* ============================================================
   🔹 GET - /ingredients
   ------------------------------------------------------------ */
export async function getIngredients(
  filters: IngredientFilterType
): Promise<PaginatedData<IngredientType>> {
  const {
    pageIndex = DEFAULT_PAGE_INDEX,
    pageSize = DEFAULT_PAGE_SIZE,
    sortBy,
    ...otherFilters
  } = filters;

  const params: Record<string, unknown> = {
    pageIndex,
    pageSize,
    ...otherFilters,
  };

  if (sortBy) {
    const [field, order] = sortBy.split(".") as [string, "asc" | "desc"];
    params.sortField = field;
    params.sortOrder = order;
  }

  const response = await axiosInstance.get<PaginatedData<IngredientType>>(
    "/ingredients",
    {
      params,
    }
  );

  return response.data;
}
