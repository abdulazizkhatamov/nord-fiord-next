import z from "zod";
import { Filters } from "@/types/api-types";

export const audienceSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1),
});

export type AudienceType = z.infer<typeof audienceSchema>;
export type AudienceFilterType = Filters<AudienceType>;
