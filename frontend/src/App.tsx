import { useSeries } from "./hooks/useSeries";
import { useMeasurements } from "./hooks/useMeasurements";
import { useLatestTimestamp } from "./hooks/useLatestTimestamp";
import { useSeriesVisibility } from "./hooks/useSeriesVisibility";
import { rangeBounds, useTimeRange } from "./hooks/useTimeRange";
import { TopBar } from "./components/TopBar";
import { SeriesChips } from "./components/SeriesChips";
import { TimeRangeControls } from "./components/TimeRangeControls";
import { TemperatureChart } from "./components/TemperatureChart";
import "./App.css";

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Nieznany błąd";
}

function App() {
  const { hidden, toggle } = useSeriesVisibility();
  const range = useTimeRange();
  const series = useSeries();

  const latest = useLatestTimestamp();
  const { from, to } = rangeBounds(range.preset, range.custom, latest.data ?? 0);
  const ready = range.preset === "custom" || latest.isSuccess;
  const measurements = useMeasurements(from, to, ready);

  return (
    <div className="app">
      <TopBar />

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

            <section className="panel" aria-label="Wykres temperatury">
              {measurements.isError ? (
                <p className="hint hint-error" role="alert">
                  Nie udało się pobrać pomiarów: {errMsg(measurements.error)}
                </p>
              ) : (
                <TemperatureChart
                  series={series.data}
                  hidden={hidden}
                  measurements={measurements.data ?? []}
                />
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
