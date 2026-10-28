import type { Measurement } from "../types";
import { get } from "./client";

export function getMeasurements(params: {
  seriesIds: number[];
  from?: string;
  to?: string;
  sort?: "timestamp" | "-timestamp";
  limit?: number;
}): Promise<Measurement[]> {
  const q = new URLSearchParams();
  if (params.seriesIds.length) q.set("series", params.seriesIds.join(","));
  if (params.from) q.set("from", params.from);
  if (params.to) q.set("to", params.to);
  if (params.sort) q.set("sort", params.sort);
  if (params.limit) q.set("limit", String(params.limit));
  return get<Measurement[]>(`/api/measurements?${q}`);
}
