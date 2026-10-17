CREATE TABLE IF NOT EXISTS "series" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"min_value" double precision NOT NULL,
	"max_value" double precision NOT NULL,
	"color" varchar(7) NOT NULL
);
