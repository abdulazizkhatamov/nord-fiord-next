import z from "zod";

export const paginationAndSortingSchema = z.object({
  pageIndex: z
    .string()
    .optional()
    .transform((val) => parseInt(val ?? "0", 10)),
  pageSize: z
    .string()
    .optional()
    .transform((val) => parseInt(val ?? "20", 10)),
  sortField: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
