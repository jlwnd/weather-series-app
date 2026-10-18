import { z } from "zod";

export const SensorInputDto = z.object({
  name: z.string().min(1).max(100),
  seriesId: z.number().int(),
});

export const SensorDto = z.object({
  id: z.number().int(),
  name: z.string(),
  seriesId: z.number().int(),
  createdAt: z.string(),
});

export const SensorCreatedDto = SensorDto.extend({
  apiKey: z.string().min(32),
});

export const SensorParamsDto = z.object({
  sensorId: z.coerce.number().int(),
});
