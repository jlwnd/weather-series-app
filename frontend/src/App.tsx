import { useSeries } from "./hooks/useSeries";
import { useMeasurements } from "./hooks/useMeasurements";
import { useSeriesVisibility } from "./hooks/useSeriesVisibility";
import { TopBar } from "./components/TopBar";
import { SeriesChips } from "./components/SeriesChips";
import { TemperatureChart } from "./components/TemperatureChart";
import "./App.css";

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Nieznany błąd";
}

function App() {
  const { hidden, toggle } = useSeriesVisibility();
  const series = useSeries();
  const measurements = useMeasurements();

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
            <section className="panel" aria-label="Filtry">
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
