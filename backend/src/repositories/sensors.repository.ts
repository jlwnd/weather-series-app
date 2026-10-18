import { eq } from "drizzle-orm";
import { db } from "../db/client.ts";
import { sensors, type Sensor } from "../db/schema.ts";

export type SensorRow = Omit<Sensor, "apiKeyHash">;

const publicColumns = {
  id: sensors.id,
  name: sensors.name,
  seriesId: sensors.seriesId,
  createdAt: sensors.createdAt,
};

export const sensorsRepository = {
  findAll: (): Promise<SensorRow[]> => db.select(publicColumns).from(sensors),

  findById: (id: number): Promise<SensorRow | undefined> =>
    db
      .select(publicColumns)
      .from(sensors)
      .where(eq(sensors.id, id))
      .then((rows) => rows[0]),

  insert: (values: {
    name: string;
    seriesId: number;
    apiKeyHash: string;
  }): Promise<SensorRow> =>
    db
      .insert(sensors)
      .values(values)
      .returning(publicColumns)
      .then((rows) => rows[0]),

  delete: (id: number): Promise<boolean> =>
    db
      .delete(sensors)
      .where(eq(sensors.id, id))
      .returning({ id: sensors.id })
      .then((rows) => rows.length > 0),
};
