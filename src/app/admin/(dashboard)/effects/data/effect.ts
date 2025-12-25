import z from "zod";
import { Filters } from "@/types/api-types";

export const effectSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1),
});

export type EffectType = z.infer<typeof effectSchema>;
export type EffectFilterType = Filters<EffectType>;
