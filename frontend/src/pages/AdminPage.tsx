import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/context";
import { useHashRoute } from "../hooks/useHashRoute";
import { useSeries } from "../hooks/useSeries";
import { createSeries } from "../queries/series";
import { getSensors } from "../queries/sensors";
import type { SeriesInput } from "../types";
import { Button } from "../components/ui/Button";
import { SeriesCard } from "../components/admin/SeriesCard";
import { SeriesForm } from "../components/admin/SeriesForm";

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Nieznany błąd";
}

export function AdminPage() {
  const { isAuthenticated, token } = useAuth();
  const { navigate } = useHashRoute();
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const series = useSeries();
  const sensors = useQuery({
    queryKey: ["sensors"],
    queryFn: () => getSensors(token!),
    enabled: isAuthenticated,
  });

  const create = useMutation({
    mutationFn: (input: SeriesInput) => createSeries(token!, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["series"] });
      setAdding(false);
    },
  });

  if (!isAuthenticated) return null;

  return (
    <main className="main">
      <div className="page-head page-head-row">
        <h1>Konfiguracja</h1>
        {!adding && (
          <Button variant="primary" onClick={() => setAdding(true)}>
            Dodaj serię
          </Button>
        )}
      </div>

      {adding && (
        <section className="panel series-card">
          <SeriesForm
            onSubmit={(input) => create.mutate(input)}
            onCancel={() => {
              create.reset();
              setAdding(false);
            }}
            pending={create.isPending}
            error={create.isError ? errMsg(create.error) : null}
          />
        </section>
      )}

      {(series.isError || sensors.isError) && (
        <p className="hint hint-error" role="alert">
          Nie udało się pobrać danych: {errMsg(series.error ?? sensors.error)}
        </p>
      )}

      {series.isSuccess &&
        series.data.map((s) => (
          <SeriesCard
            key={s.id}
            series={s}
            sensors={(sensors.data ?? []).filter((x) => x.seriesId === s.id)}
          />
        ))}

      {series.isSuccess && series.data.length === 0 && !adding && (
        <p className="hint">Brak serii.</p>
      )}
    </main>
  );
}
