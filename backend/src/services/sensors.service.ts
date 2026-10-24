import type { z } from "zod";
import { generateApiKey, sha256 } from "../lib/crypto.ts";
import { unprocessable } from "../lib/problem.ts";
import {
  sensorsRepository,
  type SensorRow,
} from "../repositories/sensors.repository.ts";
import { seriesRepository } from "../repositories/series.repository.ts";
import type { SensorDto, SensorCreatedDto } from "../dto/sensors.ts";

type SensorPublic = z.infer<typeof SensorDto>;
type SensorCreated = z.infer<typeof SensorCreatedDto>;

const toPublic = (row: SensorRow): SensorPublic => ({
  ...row,
  createdAt: row.createdAt.toISOString(),
});

export const sensorsService = {
  list: (): Promise<SensorPublic[]> =>
    sensorsRepository.findAll().then((rows) => rows.map(toPublic)),

  getById: async (id: number): Promise<SensorPublic | null> => {
    const row = await sensorsRepository.findById(id);
    return row ? toPublic(row) : null;
  },

  create: async (name: string, seriesId: number): Promise<SensorCreated> => {
    const series = await seriesRepository.findById(seriesId);
    if (!series) throw unprocessable("Series does not exist");
    const apiKey = generateApiKey();
    const created = await sensorsRepository.insert({
      name,
      seriesId,
      apiKeyHash: sha256(apiKey),
    });
    return { ...toPublic(created), apiKey };
  },

  delete: (id: number): Promise<boolean> => sensorsRepository.delete(id),

  verifyApiKey: (
    apiKey: string,
  ): Promise<{ id: number; seriesId: number } | undefined> =>
    sensorsRepository.findByApiKeyHash(sha256(apiKey)),
};
