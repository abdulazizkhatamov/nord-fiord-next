import z from "zod";
import { Filters } from "@/types/api-types";

export const formSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1),
});

export type FormType = z.infer<typeof formSchema>;
export type FormFilterType = Filters<FormType>;
