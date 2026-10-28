import { useEffect, useState } from "react";
import { CloudSun } from "lucide-react";
import { getSeries, type Series } from "./api";
import "./App.css";

function App() {
  const [series, setSeries] = useState<Series[]>([]);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSeries()
      .then((data) => {
        setSeries(data);
        setVisible(new Set(data.map((s) => s.id)));
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Nieznany błąd"),
      )
      .finally(() => setLoading(false));
  }, []);

  function toggle(id: number) {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <CloudSun size={16} strokeWidth={2.2} />
          </span>
          <span className="brand-name">WeatherSeries</span>
        </div>
        <button type="button" className="btn btn-primary">
          Zaloguj
        </button>
      </header>

      <main className="main">
        <div className="page-head">
          <h1>Temperatura w miastach</h1>
        </div>

        {loading && <p className="hint">Ładowanie serii…</p>}
        {error && (
          <p className="hint hint-error" role="alert">
            Nie udało się pobrać serii: {error}
          </p>
        )}

        {!loading && !error && (
          <section className="panel" aria-label="Filtry">
            <fieldset className="chips">
              <legend className="chips-legend">Serie</legend>
              {series.map((s) => {
                const on = visible.has(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`chip${on ? " chip-on" : ""}`}
                    aria-pressed={on}
                    onClick={() => toggle(s.id)}
                  >
                    <span
                      className="chip-swatch"
                      style={{ background: s.color }}
                      aria-hidden="true"
                    />
                    {s.name}
                  </button>
                );
              })}
            </fieldset>
          </section>
        )}

        <section className="panel placeholder" aria-label="Zawartość w budowie">
          <p>Wykres i tabela pojawią się tutaj.</p>
        </section>
      </main>
    </div>
  );
}

export default App;
