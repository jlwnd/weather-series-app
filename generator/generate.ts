import { parseArgs } from "node:util";
import {
  fetchArchiveHourly,
  fetchCurrent,
  syntheticValue,
  postMeasurement,
  type Point,
} from "./src/lib.ts";

const { values: o } = parseArgs({
  options: {
    api: { type: "string" },
    key: { type: "string" },
    mode: { type: "string", default: "backfill" },
    source: { type: "string", default: "openmeteo" },
    lat: { type: "string" },
    lon: { type: "string" },
    from: { type: "string" },
    to: { type: "string" },
    interval: { type: "string", default: "10" },
    count: { type: "string", default: "24" },
    min: { type: "string", default: "-20" },
    max: { type: "string", default: "45" },
  },
});

const api = o.api;
const key = o.key ?? process.env.SENSOR_API_KEY;
if (!api || !key) {
  console.error(
    "Usage: node generate.ts --api <URL> --key <SENSOR_KEY> [--mode backfill|live] [--source openmeteo|sine|random] [--lat --lon] [--from --to] [--interval s] [--count n] [--min --max]",
  );
  console.error(
    "The sensor key may also be provided via the SENSOR_API_KEY environment variable.",
  );
  process.exit(2);
}

const num = (v: string | undefined, d: number) =>
  v !== undefined && !Number.isNaN(Number(v)) ? Number(v) : d;
const min = num(o.min, -20);
const max = num(o.max, 45);

async function send(value: number, timestamp?: string) {
  try {
    await postMeasurement(api!, key!, value, timestamp);
    console.log(`  sent value=${value}${timestamp ? ` @ ${timestamp}` : ""}`);
  } catch (err) {
    console.error(`  ${(err as Error).message}`);
  }
}

async function backfill() {
  let points: Point[];
  if (o.source === "openmeteo") {
    const lat = num(o.lat, NaN),
      lon = num(o.lon, NaN);
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      console.error("openmeteo backfill requires --lat and --lon");
      process.exit(2);
    }
    const to =
      o.to ?? new Date(Date.now() - 6 * 86_400_000).toISOString().slice(0, 10);
    const from =
      o.from ??
      new Date(Date.now() - 9 * 86_400_000).toISOString().slice(0, 10);
    console.log(`Backfilling Open-Meteo ${lat},${lon} ${from}..${to}`);
    points = await fetchArchiveHourly(lat, lon, from, to);
  } else {
    const count = num(o.count, 24);
    points = Array.from({ length: count }, (_, i) => ({
      timestamp: new Date(Date.now() - (count - i) * 3_600_000).toISOString(),
      value: syntheticValue(o.source as "sine" | "random", min, max, i),
    }));
    console.log(`Backfilling ${count} synthetic (${o.source}) points`);
  }
  for (const p of points) await send(p.value, p.timestamp);
  console.log(`Done: ${points.length} points.`);
}

async function live() {
  const intervalMs = num(o.interval, 10) * 1000;
  const lat = num(o.lat, NaN),
    lon = num(o.lon, NaN);
  console.log(
    `Live mode every ${intervalMs / 1000}s (source=${o.source}). Ctrl+C to stop.`,
  );
  let i = 0;
  for (;;) {
    const value =
      o.source === "openmeteo"
        ? await fetchCurrent(lat, lon)
        : syntheticValue(o.source as "sine" | "random", min, max, i++);
    await send(value);
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

await (o.mode === "live" ? live() : backfill());
