import { PaginatedData } from "@/types/api-types";
import { AudienceFilterType, AudienceType } from "../data/audience";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/const/pagination";
import axiosInstance from "@/config/axios";

/* ============================================================
   🔹 GET - /audiences
   ------------------------------------------------------------ */
export async function getAudiences(
  filters: AudienceFilterType
): Promise<PaginatedData<AudienceType>> {
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

  const response = await axiosInstance.get<PaginatedData<AudienceType>>(
    "/audiences",
    {
      params,
    }
  );

  return response.data;
}
