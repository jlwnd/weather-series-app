import type { Measurement } from "../types";

export type Row = { timestamp: string; [seriesId: number]: number | string };

export function pivot(measurements: Measurement[]): Row[] {
  const byTime = new Map<string, Row>();
  for (const m of measurements) {
    let row = byTime.get(m.timestamp);
    if (!row) {
      row = { timestamp: m.timestamp };
      byTime.set(m.timestamp, row);
    }
    row[m.seriesId] = m.value;
  }
  return [...byTime.values()].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp),
  );
}

export const fmtTime = (ts: string) =>
  new Date(ts).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
