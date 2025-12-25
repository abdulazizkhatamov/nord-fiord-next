import { PaginatedData } from "@/types/api-types";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/const/pagination";
import axiosInstance from "@/config/axios";
import { EffectFilterType, EffectType } from "../data/effect";

/* ============================================================
   🔹 GET - /effects
   ------------------------------------------------------------ */
export async function getEffects(
  filters: EffectFilterType
): Promise<PaginatedData<EffectType>> {
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

  const response = await axiosInstance.get<PaginatedData<EffectType>>(
    "/effects",
    {
      params,
    }
  );

  return response.data;
}
