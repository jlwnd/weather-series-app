import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Series } from "../types";
import { fmtTime, type Row } from "../lib/rows";

const DASH = [undefined, "6 4", "2 4", "8 4 2 4"];

export function TemperatureChart({
  series,
  hidden,
  rows,
  selected,
  onSelect,
}: {
  series: Series[];
  hidden: Set<number>;
  rows: Row[];
  selected: string | null;
  onSelect: (timestamp: string) => void;
}) {
  const shown = series.filter((s) => !hidden.has(s.id));

  if (rows.length === 0) {
    return <p className="hint">Brak danych w wybranym zakresie.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart
        data={rows}
        margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
        onClick={(state) => {
          const label = state?.activeLabel;
          if (label != null) onSelect(String(label));
        }}
      >
        <CartesianGrid stroke="#303136" vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={fmtTime}
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
          labelFormatter={(label) => fmtTime(String(label))}
          contentStyle={{
            background: "#26272b",
            border: "1px solid #3a3b41",
            borderRadius: 8,
            color: "#f2f3f5",
          }}
          labelStyle={{ color: "#8a8d94" }}
        />
        {selected && (
          <ReferenceLine x={selected} stroke="#f2f3f5" strokeDasharray="3 3" />
        )}
        {shown.map((s) => (
          <Line
            key={s.id}
            type="monotone"
            dataKey={String(s.id)}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
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
