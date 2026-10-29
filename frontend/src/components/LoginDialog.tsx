import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/context";
import { Modal } from "./Modal";

export function LoginDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Logowanie nie powiodło się",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Logowanie administratora"
      titleId="login-title"
    >
      <form className="form" onSubmit={submit}>
        <label className="field">
          <span>Nazwa użytkownika</span>
          <input
            name="username"
            autoComplete="username"
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Hasło</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Logowanie…" : "Zaloguj"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
