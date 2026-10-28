import { useState } from "react";

export type RangePreset = "24h" | "7d" | "custom";
export type CustomRange = { from: string; to: string };

const DAY = 24 * 60 * 60 * 1000;

export function useTimeRange() {
  const [preset, setPreset] = useState<RangePreset>("7d");
  const [custom, setCustom] = useState<CustomRange>({ from: "", to: "" });
  return { preset, setPreset, custom, setCustom };
}

export function rangeBounds(
  preset: RangePreset,
  custom: CustomRange,
  latestMs: number,
): { from?: string; to?: string } {
  if (preset === "custom") {
    return {
      from: custom.from ? new Date(custom.from).toISOString() : undefined,
      to: custom.to ? new Date(custom.to).toISOString() : undefined,
    };
  }
  if (!latestMs) return {};
  const span = preset === "24h" ? DAY : 7 * DAY;
  return {
    from: new Date(latestMs - span).toISOString(),
    to: new Date(latestMs).toISOString(),
  };
}
