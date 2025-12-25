import { PaginatedData } from "@/types/api-types";
import { ProductFilterType, ProductType } from "../data/product";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/const/pagination";
import axiosInstance from "@/config/axios";

/* ============================================================
   🔹 GET - /products
   ------------------------------------------------------------ */
export async function getProducts(
  filters: ProductFilterType
): Promise<PaginatedData<ProductType>> {
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

  const response = await axiosInstance.get<PaginatedData<ProductType>>(
    "/products",
    {
      params,
    }
  );

  return response.data;
}

/* ============================================================
   🔹 GET - /products/${id}
   ------------------------------------------------------------ */
export async function getProduct(id: string): Promise<ProductType> {
  const response = await axiosInstance.get<ProductType>(`/products/${id}`);
  return response.data;
}

/* ============================================================
   🔹 POST - /products
   ------------------------------------------------------------ */
interface PostProductPayload {
  name: string;
  description: string;
  categoryId: string;
  forms: string[];
  effects: string[];
  ingredients: string[];
  audiences: string[];
  availability: boolean;
}

export async function postProduct(
  data: PostProductPayload
): Promise<ProductType> {
  const response = await axiosInstance.post<ProductType>("/products", data);
  return response.data;
}

/* ============================================================
   🔹 PUT - /products/[id]
   ------------------------------------------------------------ */
interface PutProductPayload {
  id: string;
  name?: string;
  description?: string;
  categoryId?: string;
  forms?: string[];
  effects?: string[];
  ingredients?: string[];
  audiences?: string[];
  availability: boolean;
}

export async function putProduct({
  id,
  ...data
}: PutProductPayload): Promise<ProductType> {
  const response = await axiosInstance.put<ProductType>(
    `/products/${id}`,
    data
  );
  return response.data;
}
