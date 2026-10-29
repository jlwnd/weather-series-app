import { useState } from "react";
import { CloudSun, KeyRound, LogOut } from "lucide-react";
import { useAuth } from "../auth/context";
import { LoginDialog } from "./LoginDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export function TopBar() {
  const { isAuthenticated, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <CloudSun size={16} strokeWidth={2.2} />
        </span>
        <span className="brand-name">WeatherSeries</span>
      </div>

      <div className="topbar-actions">
        {isAuthenticated ? (
          <>
            <button
              type="button"
              className="btn"
              onClick={() => setPasswordOpen(true)}
            >
              <KeyRound size={15} aria-hidden="true" /> Zmień hasło
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => void logout()}
            >
              <LogOut size={15} aria-hidden="true" /> Wyloguj
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setLoginOpen(true)}
          >
            Zaloguj
          </button>
        )}
      </div>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      <ChangePasswordDialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
    </header>
  );
}
