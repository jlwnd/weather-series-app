import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  lte,
  or,
  type SQL,
} from "drizzle-orm";
import { db } from "../db/client.ts";
import { measurements, type Measurement } from "../db/schema.ts";

export interface MeasurementFilter {
  seriesIds?: number[];
  from?: Date;
  to?: Date;
  sort: "timestamp" | "-timestamp";
  limit: number;
}

export const measurementsRepository = {
  findMany: (f: MeasurementFilter): Promise<Measurement[]> => {
    const conds: SQL[] = [];
    if (f.seriesIds) conds.push(inArray(measurements.seriesId, f.seriesIds));
    if (f.from) conds.push(gte(measurements.timestamp, f.from));
    if (f.to) conds.push(lte(measurements.timestamp, f.to));
    const order =
      f.sort === "-timestamp"
        ? desc(measurements.timestamp)
        : asc(measurements.timestamp);
    return db
      .select()
      .from(measurements)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(order)
      .limit(f.limit);
  },

  findById: (id: number): Promise<Measurement | undefined> =>
    db
      .select()
      .from(measurements)
      .where(eq(measurements.id, id))
      .then((rows) => rows[0]),

  insert: (values: {
    seriesId: number;
    sensorId: number;
    value: number;
    timestamp: Date;
  }): Promise<Measurement> =>
    db
      .insert(measurements)
      .values(values)
      .returning()
      .then((rows) => rows[0]!),

  existsOutsideRange: (
    seriesId: number,
    min: number,
    max: number,
  ): Promise<boolean> =>
    db
      .select({ id: measurements.id })
      .from(measurements)
      .where(
        and(
          eq(measurements.seriesId, seriesId),
          or(lt(measurements.value, min), gt(measurements.value, max)),
        ),
      )
      .limit(1)
      .then((rows) => rows.length > 0),
};
