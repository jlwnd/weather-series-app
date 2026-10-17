import { eq } from "drizzle-orm";
import { db } from "../db/client.ts";
import { series, type Series } from "../db/schema.ts";

type SeriesInput = Omit<Series, "id">;

export const seriesRepository = {
  findAll: (): Promise<Series[]> => db.select().from(series),

  findById: (id: number): Promise<Series | undefined> =>
    db
      .select()
      .from(series)
      .where(eq(series.id, id))
      .then((rows) => rows[0]),

  insert: (values: SeriesInput): Promise<Series> =>
    db
      .insert(series)
      .values(values)
      .returning()
      .then((rows) => rows[0]),

  update: (id: number, values: SeriesInput): Promise<Series | undefined> =>
    db
      .update(series)
      .set(values)
      .where(eq(series.id, id))
      .returning()
      .then((rows) => rows[0]),

  delete: (id: number): Promise<boolean> =>
    db
      .delete(series)
      .where(eq(series.id, id))
      .returning({ id: series.id })
      .then((rows) => rows.length > 0),
};
