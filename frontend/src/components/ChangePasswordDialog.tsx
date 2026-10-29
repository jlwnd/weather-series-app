import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/context";
import { Modal } from "./Modal";

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
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Zamknij
            </button>
          </div>
        </div>
      ) : (
        <form className="form" onSubmit={submit}>
          <label className="field">
            <span>Obecne hasło</span>
            <input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Nowe hasło (min. 8 znaków)</span>
            <input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Powtórz nowe hasło</span>
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>
          {error && (
            <p className="hint hint-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={loading}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Zapisywanie…" : "Zmień hasło"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
