import { useMemo, useState } from "react";
import { useSeries } from "../hooks/useSeries";
import { useMeasurements } from "../hooks/useMeasurements";
import { useLatestTimestamp } from "../hooks/useLatestTimestamp";
import { useSeriesVisibility } from "../hooks/useSeriesVisibility";
import { rangeBounds, useTimeRange } from "../hooks/useTimeRange";
import { pivot } from "../lib/rows";
import { SeriesChips } from "./SeriesChips";
import { TimeRangeControls } from "./TimeRangeControls";
import { TemperatureChart } from "./TemperatureChart";
import { TemperatureTable } from "./TemperatureTable";

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Nieznany błąd";
}

export function Dashboard() {
  const { hidden, toggle } = useSeriesVisibility();
  const range = useTimeRange();
  const series = useSeries();

  const latest = useLatestTimestamp();
  const { from, to } = rangeBounds(range.preset, range.custom, latest.data ?? 0);
  const ready = range.preset === "custom" || latest.isSuccess;
  const measurements = useMeasurements(from, to, ready);

  const rows = useMemo(() => pivot(measurements.data ?? []), [measurements.data]);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <main className="main">
      <div className="page-head">
        <h1>Temperatura w miastach</h1>
      </div>

      {series.isPending && <p className="hint">Ładowanie serii…</p>}
      {series.isError && (
        <p className="hint hint-error" role="alert">
          Nie udało się pobrać serii: {errMsg(series.error)}
        </p>
      )}

      {series.isSuccess && (
        <>
          <section className="panel filters" aria-label="Filtry">
            <TimeRangeControls
              preset={range.preset}
              custom={range.custom}
              onPreset={range.setPreset}
              onCustom={range.setCustom}
            />
            <SeriesChips
              series={series.data}
              hidden={hidden}
              onToggle={toggle}
            />
          </section>

          {measurements.isError ? (
            <section className="panel" aria-label="Wykres temperatury">
              <p className="hint hint-error" role="alert">
                Nie udało się pobrać pomiarów: {errMsg(measurements.error)}
              </p>
            </section>
          ) : (
            <>
              <section className="panel" aria-label="Wykres temperatury">
                <TemperatureChart
                  series={series.data}
                  hidden={hidden}
                  rows={rows}
                  selected={selected}
                  onSelect={setSelected}
                />
              </section>

              <section className="panel" aria-label="Tabela pomiarów">
                <TemperatureTable
                  series={series.data}
                  hidden={hidden}
                  rows={rows}
                  selected={selected}
                  onSelect={setSelected}
                />
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
}
