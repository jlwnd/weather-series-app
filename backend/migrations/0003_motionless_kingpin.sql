CREATE TABLE IF NOT EXISTS "measurements" (
	"id" serial PRIMARY KEY NOT NULL,
	"series_id" integer NOT NULL,
	"sensor_id" integer,
	"value" double precision NOT NULL,
	"timestamp" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "measurements" ADD CONSTRAINT "measurements_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "measurements" ADD CONSTRAINT "measurements_sensor_id_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensors"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "measurements_series_ts_idx" ON "measurements" USING btree ("series_id","timestamp");