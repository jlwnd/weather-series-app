import type { z } from "zod";
import { unprocessable } from "../lib/problem.ts";
import {
  measurementsRepository,
  type MeasurementFilter,
} from "../repositories/measurements.repository.ts";
import { seriesRepository } from "../repositories/series.repository.ts";
import type { Measurement } from "../db/schema.ts";
import type { MeasurementDto, MeasurementQueryDto } from "../dto/measurements.ts";

type MeasurementPublic = z.infer<typeof MeasurementDto>;
type Query = z.infer<typeof MeasurementQueryDto>;

const FUTURE_TOLERANCE_MS = 5 * 60_000;

const toPublic = (row: Measurement): MeasurementPublic => ({
  ...row,
  timestamp: row.timestamp.toISOString(),
});

export const measurementsService = {
  list: (q: Query): Promise<MeasurementPublic[]> => {
    const filter: MeasurementFilter = { sort: q.sort, limit: q.limit };
    if (q.series !== undefined) {
      const ids = q.series
        .split(",")
        .map((s) => Number(s))
        .filter((n) => Number.isInteger(n));
      filter.seriesIds = ids.length ? ids : [-1];
    }
    if (q.from !== undefined) filter.from = new Date(q.from);
    if (q.to !== undefined) filter.to = new Date(q.to);
    return measurementsRepository
      .findMany(filter)
      .then((rows) => rows.map(toPublic));
  },

  getById: async (id: number): Promise<MeasurementPublic | null> => {
    const row = await measurementsRepository.findById(id);
    return row ? toPublic(row) : null;
  },

  create: async (
    sensor: { id: number; seriesId: number },
    value: number,
    timestamp?: string,
  ): Promise<MeasurementPublic> => {
    let ts: Date;
    if (timestamp !== undefined) {
      ts = new Date(timestamp);
      if (ts.getTime() > Date.now() + FUTURE_TOLERANCE_MS)
        throw unprocessable("Timestamp is more than 5 minutes in the future");
    } else {
      ts = new Date();
    }

    const series = await seriesRepository.findById(sensor.seriesId);
    if (!series) throw unprocessable("Series no longer exists");
    if (value < series.minValue || value > series.maxValue)
      throw unprocessable(
        `Value ${value} is outside the series range [${series.minValue}, ${series.maxValue}]`,
      );

    const created = await measurementsRepository.insert({
      seriesId: sensor.seriesId,
      sensorId: sensor.id,
      value,
      timestamp: ts,
    });
    return toPublic(created);
  },
};
