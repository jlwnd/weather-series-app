import { useState, type FormEvent } from "react";
import type { SeriesInput } from "../../types";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";

export function SeriesForm({
  initial,
  onSubmit,
  onCancel,
  pending,
  error,
}: {
  initial?: SeriesInput;
  onSubmit: (input: SeriesInput) => void;
  onCancel: () => void;
  pending: boolean;
  error: string | null;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [min, setMin] = useState(String(initial?.minValue ?? ""));
  const [max, setMax] = useState(String(initial?.maxValue ?? ""));
  const [color, setColor] = useState(initial?.color ?? "#4a9eff");
  const [localError, setLocalError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const minValue = Number(min);
    const maxValue = Number(max);
    if (!name.trim()) return setLocalError("Nazwa jest wymagana.");
    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue))
      return setLocalError("Min i max muszą być liczbami.");
    if (minValue >= maxValue)
      return setLocalError("Min musi być mniejsze niż max.");
    setLocalError(null);
    onSubmit({ name: name.trim(), minValue, maxValue, color });
  }

  return (
    <form className="series-edit" onSubmit={submit}>
      <Field
        label="Nazwa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoFocus
      />
      <Field
        label="Min °C"
        type="number"
        step="any"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        required
      />
      <Field
        label="Max °C"
        type="number"
        step="any"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        required
      />
      <Field
        label="Kolor"
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <div className="form-actions">
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending ? "Zapisywanie…" : "Zapisz"}
        </Button>
        <Button size="sm" onClick={onCancel} disabled={pending}>
          Anuluj
        </Button>
      </div>
      {(localError || error) && (
        <p
          className="hint hint-error"
          role="alert"
          style={{ gridColumn: "1 / -1" }}
        >
          {localError ?? error}
        </p>
      )}
    </form>
  );
}
