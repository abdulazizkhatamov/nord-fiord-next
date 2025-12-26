import { PaginatedData } from "@/types/api-types";
import { CategoryFilterType, CategoryType } from "../data/categorySchema";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/const/pagination";
import axiosInstance from "@/config/axios";

/* ============================================================
   🔹 GET - /categories
   ------------------------------------------------------------ */
export async function getCategories(
  filters: CategoryFilterType
): Promise<PaginatedData<CategoryType>> {
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

  const response = await axiosInstance.get<PaginatedData<CategoryType>>(
    "/categories",
    {
      params,
    }
  );

  return response.data;
}

/* ============================================================
   🔹 GET - /categories/${id}
   ------------------------------------------------------------ */
export async function getCategory(id: string): Promise<CategoryType> {
  const response = await axiosInstance.get<CategoryType>(`/categories/${id}`);
  return response.data;
}

/* ============================================================
   🔹 POST - /categories
   ------------------------------------------------------------ */
interface PostCategoryPayload {
  name: string;
  parentId?: string | null;
}

export async function postCategory(
  data: PostCategoryPayload
): Promise<CategoryType> {
  const response = await axiosInstance.post<CategoryType>("/categories", data);
  return response.data;
}

/* ============================================================
   🔹 PUT - /categories/[id]
   ------------------------------------------------------------ */
interface PutCategoryPayload {
  id: string;
  name?: string;
  parentId?: string | null;
}

export async function putCategory({
  id,
  ...data
}: PutCategoryPayload): Promise<CategoryType> {
  const response = await axiosInstance.put<CategoryType>(
    `/categories/${id}`,
    data
  );
  return response.data;
}
