import { CloudSun } from "lucide-react";

export function TopBar() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <CloudSun size={16} strokeWidth={2.2} />
        </span>
        <span className="brand-name">WeatherSeries</span>
      </div>
      <button type="button" className="btn btn-primary">
        Zaloguj
      </button>
    </header>
  );
}
