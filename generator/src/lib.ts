const ARCHIVE_BASE = "https://archive-api.open-meteo.com/v1/archive";
const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";

export interface Point {
  timestamp: string;
  value: number;
}

export async function fetchArchiveHourly(
  lat: number,
  lon: number,
  from: string,
  to: string,
): Promise<Point[]> {
  const url = `${ARCHIVE_BASE}?latitude=${lat}&longitude=${lon}&start_date=${from}&end_date=${to}&hourly=temperature_2m&timezone=UTC`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo archive responded ${res.status}`);
  const data = (await res.json()) as {
    hourly: { time: string[]; temperature_2m: (number | null)[] };
  };
  const points: Point[] = [];
  data.hourly.time.forEach((t, i) => {
    const v = data.hourly.temperature_2m[i];
    if (v !== null)
      points.push({ timestamp: new Date(`${t}:00Z`).toISOString(), value: v });
  });
  return points;
}

export async function fetchCurrent(lat: number, lon: number): Promise<number> {
  const url = `${FORECAST_BASE}?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=UTC`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo forecast responded ${res.status}`);
  const data = (await res.json()) as { current: { temperature_2m: number } };
  return data.current.temperature_2m;
}

export function syntheticValue(
  mode: "sine" | "random",
  min: number,
  max: number,
  step: number,
): number {
  const mid = (min + max) / 2;
  const amp = (max - min) / 2;
  if (mode === "sine")
    return +(mid + amp * 0.8 * Math.sin(step / 4)).toFixed(2);
  return +(min + Math.random() * (max - min)).toFixed(2);
}

export async function postMeasurement(
  api: string,
  key: string,
  value: number,
  timestamp?: string,
): Promise<void> {
  const body: Record<string, unknown> = { value };
  if (timestamp) body.timestamp = timestamp;
  const res = await fetch(`${api.replace(/\/+$/, "")}/api/measurements`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-Key": key },
    body: JSON.stringify(body),
  });
  if (res.status !== 201) {
    const text = await res.text();
    throw new Error(`Rejected (${res.status}): ${text}`);
  }
}
