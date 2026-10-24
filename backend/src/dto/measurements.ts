import { z } from "zod";

export const MeasurementInputDto = z.object({
  value: z.number(),
  timestamp: z.string().datetime({ offset: true }).optional(),
});

export const MeasurementDto = z.object({
  id: z.number().int(),
  seriesId: z.number().int(),
  sensorId: z.number().int().nullable(),
  value: z.number(),
  timestamp: z.string(),
});

export const MeasurementQueryDto = z.object({
  series: z.string().optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
  sort: z.enum(["timestamp", "-timestamp"]).default("timestamp"),
  limit: z.coerce.number().int().min(1).max(10000).default(1000),
});

export const MeasurementParamsDto = z.object({
  measurementId: z.coerce.number().int(),
});
