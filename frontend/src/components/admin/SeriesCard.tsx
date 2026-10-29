import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Sensor, SensorCreated, Series, SeriesInput } from "../../types";
import { useAuth } from "../../auth/context";
import { deleteSeries, updateSeries } from "../../queries/series";
import { createSensor, deleteSensor } from "../../queries/sensors";
import { Modal } from "../Modal";
import { Button } from "../ui/Button";
import { SeriesForm } from "./SeriesForm";
import { SensorForm } from "./SensorForm";

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Nieznany błąd";
}

export function SeriesCard({
  series,
  sensors,
}: {
  series: Series;
  sensors: Sensor[];
}) {
  const { token } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [addingSensor, setAddingSensor] = useState(false);
  const [confirmingSensor, setConfirmingSensor] = useState<number | null>(null);
  const [createdKey, setCreatedKey] = useState<SensorCreated | null>(null);
  const [copied, setCopied] = useState(false);

  const invalidateSensors = () =>
    qc.invalidateQueries({ queryKey: ["sensors"] });

  const update = useMutation({
    mutationFn: (input: SeriesInput) => updateSeries(token!, series.id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["series"] });
      setEditing(false);
    },
  });

  const remove = useMutation({
    mutationFn: () => deleteSeries(token!, series.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["series"] });
      invalidateSensors();
    },
  });

  const addSensor = useMutation({
    mutationFn: (name: string) =>
      createSensor(token!, { name, seriesId: series.id }),
    onSuccess: (created) => {
      invalidateSensors();
      setAddingSensor(false);
      setCopied(false);
      setCreatedKey(created);
    },
  });

  const removeSensor = useMutation({
    mutationFn: (id: number) => deleteSensor(token!, id),
    onSuccess: () => {
      invalidateSensors();
      setConfirmingSensor(null);
    },
  });

  async function copyKey() {
    if (!createdKey) return;
    await navigator.clipboard.writeText(createdKey.apiKey);
    setCopied(true);
  }

  return (
    <section className="panel series-card" aria-label={`Seria ${series.name}`}>
      {editing ? (
        <SeriesForm
          initial={{
            name: series.name,
            minValue: series.minValue,
            maxValue: series.maxValue,
            color: series.color,
          }}
          onSubmit={(input) => update.mutate(input)}
          onCancel={() => {
            update.reset();
            setEditing(false);
          }}
          pending={update.isPending}
          error={update.isError ? errMsg(update.error) : null}
        />
      ) : (
        <div className="series-head">
          <span
            className="series-swatch"
            style={{ background: series.color }}
            aria-hidden="true"
          />
          <span className="series-name">{series.name}</span>
          <span className="series-meta">
            {series.minValue} … {series.maxValue} °C
          </span>
          <span className="spacer" />
          {confirmingDelete ? (
            <span className="confirm-inline">
              Usunąć serię wraz z czujnikami i wynikami?
              <Button
                variant="danger"
                size="sm"
                onClick={() => remove.mutate()}
                disabled={remove.isPending}
              >
                {remove.isPending ? "Usuwanie…" : "Usuń"}
              </Button>
              <Button
                size="sm"
                onClick={() => setConfirmingDelete(false)}
                disabled={remove.isPending}
              >
                Anuluj
              </Button>
            </span>
          ) : (
            <>
              <Button size="sm" onClick={() => setEditing(true)}>
                Edytuj
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmingDelete(true)}
              >
                Usuń serię
              </Button>
            </>
          )}
        </div>
      )}

      {remove.isError && (
        <p
          className="hint hint-error"
          role="alert"
          style={{ padding: "0 16px 12px" }}
        >
          {errMsg(remove.error)}
        </p>
      )}

      <div className="sensors">
        {sensors.length === 0 ? (
          <div className="sensor-row">
            <span className="sensor-empty">
              Brak czujników - dodaj jeden, aby zacząć zbierać dane.
            </span>
          </div>
        ) : (
          sensors.map((s) => (
            <div className="sensor-row" key={s.id}>
              <span className="sensor-name">{s.name}</span>
              <span className="sensor-date">
                dodany {s.createdAt.slice(0, 10)}
              </span>
              <span className="spacer" />
              {confirmingSensor === s.id ? (
                <span className="confirm-inline">
                  Wyrejestrować? Klucz przestanie działać, wyniki zostają.
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeSensor.mutate(s.id)}
                    disabled={removeSensor.isPending}
                  >
                    {removeSensor.isPending ? "…" : "Wyrejestruj"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setConfirmingSensor(null)}
                    disabled={removeSensor.isPending}
                  >
                    Anuluj
                  </Button>
                </span>
              ) : (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmingSensor(s.id)}
                >
                  Wyrejestruj
                </Button>
              )}
            </div>
          ))
        )}

        {addingSensor ? (
          <SensorForm
            onSubmit={(name) => addSensor.mutate(name)}
            onCancel={() => {
              addSensor.reset();
              setAddingSensor(false);
            }}
            pending={addSensor.isPending}
            error={addSensor.isError ? errMsg(addSensor.error) : null}
          />
        ) : (
          <div className="add-sensor">
            <Button size="sm" onClick={() => setAddingSensor(true)}>
              Dodaj czujnik
            </Button>
          </div>
        )}
      </div>

      <Modal
        open={createdKey !== null}
        onClose={() => setCreatedKey(null)}
        title={`Czujnik „${createdKey?.name ?? ""}" zarejestrowany`}
        titleId={`sensor-key-${series.id}`}
        size="lg"
      >
        <div className="form">
          <p className="hint">
            Skopiuj klucz API teraz - zobaczysz go tylko ten jeden raz. Wpisz go
            do generatora jako parametr lub zmienną środowiskową.
          </p>
          <div className="key-box">
            <span>{createdKey?.apiKey}</span>
            <Button size="sm" onClick={() => void copyKey()}>
              {copied ? "Skopiowano" : "Kopiuj"}
            </Button>
          </div>
          <p className="hint hint-error" role="alert">
            Po zamknięciu klucza nie da się odzyskać.
          </p>
          <div className="form-actions">
            <Button variant="primary" onClick={() => setCreatedKey(null)}>
              Zapisałem klucz - zamknij
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
