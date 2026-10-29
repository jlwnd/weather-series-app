import { useEffect, useRef } from "react";
import type { Series } from "../types";
import { fmtTime, type Row } from "../lib/rows";

const fmtVal = (v: number | string | undefined) =>
  typeof v === "number" ? `${v.toFixed(1).replace(".", ",")}°` : "-";

export function TemperatureTable({
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
  const cols = series.filter((s) => !hidden.has(s.id));
  const selRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    selRef.current?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (rows.length === 0) {
    return <p className="hint">Brak danych w wybranym zakresie.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Czas</th>
            {cols.map((s) => (
              <th scope="col" key={s.id}>
                {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const sel = selected === r.timestamp;
            return (
              <tr
                key={r.timestamp}
                ref={sel ? selRef : undefined}
                className={sel ? "row-selected" : undefined}
                aria-selected={sel}
                tabIndex={0}
                onClick={() => onSelect(r.timestamp)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(r.timestamp);
                  }
                }}
              >
                <td>{fmtTime(r.timestamp)}</td>
                {cols.map((s) => (
                  <td key={s.id} className="num">
                    {fmtVal(r[s.id])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
