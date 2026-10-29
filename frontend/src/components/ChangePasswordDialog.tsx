import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/context";
import { Modal } from "./Modal";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";

export function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { changePassword } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (next !== confirm) {
      setError("Nowe hasła nie są identyczne");
      return;
    }
    setLoading(true);
    try {
      await changePassword(current, next);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Zmiana hasła nie powiodła się",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Zmiana hasła"
      titleId="password-title"
    >
      {done ? (
        <div className="form">
          <p className="hint" role="status">
            Hasło zostało zmienione.
          </p>
          <div className="form-actions">
            <Button variant="primary" onClick={onClose}>
              Zamknij
            </Button>
          </div>
        </div>
      ) : (
        <form className="form" onSubmit={submit}>
          <Field
            label="Obecne hasło"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <Field
            label="Nowe hasło (min. 8 znaków)"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          <Field
            label="Powtórz nowe hasło"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {error && (
            <p className="hint hint-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <Button onClick={onClose} disabled={loading}>
              Anuluj
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Zapisywanie…" : "Zmień hasło"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
