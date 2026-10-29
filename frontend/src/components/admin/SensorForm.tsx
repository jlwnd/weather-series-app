import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";

export function SensorForm({
  onSubmit,
  onCancel,
  pending,
  error,
}: {
  onSubmit: (name: string) => void;
  onCancel: () => void;
  pending: boolean;
  error: string | null;
}) {
  const [name, setName] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  }

  return (
    <form className="add-sensor sensor-form" onSubmit={submit}>
      <Field
        label="Nazwa czujnika"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoFocus
      />
      <div className="form-actions">
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending ? "Rejestrowanie…" : "Zarejestruj"}
        </Button>
        <Button size="sm" onClick={onCancel} disabled={pending}>
          Anuluj
        </Button>
      </div>
      {error && (
        <p className="hint hint-error" role="alert" style={{ flexBasis: "100%" }}>
          {error}
        </p>
      )}
    </form>
  );
}
