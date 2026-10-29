import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/context";
import { Modal } from "./Modal";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";

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
        <Field
          label="Nazwa użytkownika"
          name="username"
          autoComplete="username"
          required
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Field
          label="Hasło"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Logowanie…" : "Zaloguj"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
