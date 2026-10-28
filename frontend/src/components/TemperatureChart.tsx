import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Measurement, Series } from "../types";

// Series are distinguished by line style as well as colour (WCAG: not colour alone).
const DASH = [undefined, "6 4", "2 4", "8 4 2 4"];

type Row = { timestamp: string; [seriesId: number]: number | string };

function pivot(measurements: Measurement[]): Row[] {
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

const fmtTick = (ts: string) =>
  new Date(ts).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export function TemperatureChart({
  series,
  hidden,
  measurements,
}: {
  series: Series[];
  hidden: Set<number>;
  measurements: Measurement[];
}) {
  const rows = useMemo(() => pivot(measurements), [measurements]);
  const shown = series.filter((s) => !hidden.has(s.id));

  if (rows.length === 0) {
    return <p className="hint">Brak danych w wybranym zakresie.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="#303136" vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={fmtTick}
          minTickGap={48}
          tick={{ fill: "#8a8d94", fontSize: 12 }}
          stroke="#3a3b41"
        />
        <YAxis
          width={44}
          tick={{ fill: "#8a8d94", fontSize: 12 }}
          stroke="#3a3b41"
          unit="°"
        />
        <Tooltip
          labelFormatter={(label) => fmtTick(String(label))}
          contentStyle={{
            background: "#26272b",
            border: "1px solid #3a3b41",
            borderRadius: 8,
            color: "#f2f3f5",
          }}
          labelStyle={{ color: "#8a8d94" }}
        />
        {shown.map((s) => (
          <Line
            key={s.id}
            type="monotone"
            dataKey={String(s.id)}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            // stable dash per series, independent of which are toggled on
            strokeDasharray={DASH[series.indexOf(s) % DASH.length]}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
