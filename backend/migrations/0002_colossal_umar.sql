CREATE TABLE IF NOT EXISTS "sensors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"series_id" integer NOT NULL,
	"api_key_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sensors_api_key_hash_unique" UNIQUE("api_key_hash")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensors" ADD CONSTRAINT "sensors_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
