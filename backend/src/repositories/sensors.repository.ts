import { eq } from "drizzle-orm";
import { db } from "../db/client.ts";
import { sensors } from "../db/schema.ts";

const publicColumns = {
  id: sensors.id,
  name: sensors.name,
  seriesId: sensors.seriesId,
  createdAt: sensors.createdAt,
};

type SensorPublic = {
  id: number;
  name: string;
  seriesId: number;
  createdAt: string;
};

const toPublic = (row: {
  id: number;
  name: string;
  seriesId: number;
  createdAt: Date;
}): SensorPublic => ({ ...row, createdAt: row.createdAt.toISOString() });

export const sensorsRepository = {
  findAll: (): Promise<SensorPublic[]> =>
    db
      .select(publicColumns)
      .from(sensors)
      .then((rows) => rows.map(toPublic)),

  findById: (id: number): Promise<SensorPublic | undefined> =>
    db
      .select(publicColumns)
      .from(sensors)
      .where(eq(sensors.id, id))
      .then((rows) => (rows[0] ? toPublic(rows[0]) : undefined)),

  insert: (values: {
    name: string;
    seriesId: number;
    apiKeyHash: string;
  }): Promise<SensorPublic> =>
    db
      .insert(sensors)
      .values(values)
      .returning(publicColumns)
      .then((rows) => toPublic(rows[0])),

  delete: (id: number): Promise<boolean> =>
    db
      .delete(sensors)
      .where(eq(sensors.id, id))
      .returning({ id: sensors.id })
      .then((rows) => rows.length > 0),
};
