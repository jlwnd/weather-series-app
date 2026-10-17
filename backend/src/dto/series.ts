import { z } from "zod";

export const SeriesInputDto = z.object({
  name: z.string().min(1).max(100),
  minValue: z.number(),
  maxValue: z.number(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const SeriesDto = z.object({
  id: z.number().int(),
  name: z.string(),
  minValue: z.number(),
  maxValue: z.number(),
  color: z.string(),
});

export const SeriesParamsDto = z.object({
  seriesId: z.coerce.number().int(),
});
