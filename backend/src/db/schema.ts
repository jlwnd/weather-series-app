import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  doublePrecision,
  index,
} from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const sessions = pgTable("sessions", {
  tokenHash: varchar("token_hash", { length: 64 }).primaryKey(),
  adminId: integer("admin_id")
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  minValue: doublePrecision("min_value").notNull(),
  maxValue: doublePrecision("max_value").notNull(),
  color: varchar("color", { length: 7 }).notNull(),
});

export const sensors = pgTable("sensors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  seriesId: integer("series_id")
    .notNull()
    .references(() => series.id, { onDelete: "cascade" }),
  apiKeyHash: varchar("api_key_hash", { length: 64 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const measurements = pgTable(
  "measurements",
  {
    id: serial("id").primaryKey(),
    seriesId: integer("series_id")
      .notNull()
      .references(() => series.id, { onDelete: "cascade" }),
    sensorId: integer("sensor_id").references(() => sensors.id, {
      onDelete: "set null",
    }),
    value: doublePrecision("value").notNull(),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  },
  (t) => [index("measurements_series_ts_idx").on(t.seriesId, t.timestamp)],
);

export type Admin = typeof admins.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Series = typeof series.$inferSelect;
export type Sensor = typeof sensors.$inferSelect;
export type Measurement = typeof measurements.$inferSelect;
