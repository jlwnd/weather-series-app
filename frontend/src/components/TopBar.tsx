import { useState } from "react";
import { CloudSun, KeyRound, LogOut } from "lucide-react";
import { useAuth } from "../auth/context";
import { useHashRoute } from "../hooks/useHashRoute";
import { Button } from "./ui/Button";
import { LoginDialog } from "./LoginDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export function TopBar() {
  const { isAuthenticated, logout } = useAuth();
  const { route } = useHashRoute();
  const [loginOpen, setLoginOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const navClass = (to: string) =>
    `navlink${route === to ? " active" : ""}`;

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <CloudSun size={16} strokeWidth={2.2} />
        </span>
        <span className="brand-name">WeatherSeries</span>
      </div>

      <div className="topbar-right">
        <nav className="nav" aria-label="Nawigacja">
          <a className={navClass("/")} href="#/">
            Pulpit
          </a>
          {isAuthenticated && (
            <a
              className={navClass("/konfiguracja")}
              href="#/konfiguracja"
            >
              Konfiguracja
            </a>
          )}
        </nav>
        <span className="topbar-divider" aria-hidden="true" />
        <div className="topbar-actions">
          {isAuthenticated ? (
          <>
            <Button
              icon={<KeyRound size={15} aria-hidden="true" />}
              onClick={() => setPasswordOpen(true)}
            >
              Zmień hasło
            </Button>
            <Button
              icon={<LogOut size={15} aria-hidden="true" />}
              onClick={() => void logout()}
            >
              Wyloguj
            </Button>
          </>
        ) : (
            <Button variant="primary" onClick={() => setLoginOpen(true)}>
              Zaloguj
            </Button>
          )}
        </div>
      </div>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      <ChangePasswordDialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
    </header>
  );
}
