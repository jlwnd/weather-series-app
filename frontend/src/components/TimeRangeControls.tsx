import type { CustomRange, RangePreset } from "../hooks/useTimeRange";

const PRESETS: { id: RangePreset; label: string }[] = [
  { id: "24h", label: "24 h" },
  { id: "7d", label: "7 dni" },
  { id: "custom", label: "Zakres…" },
];

export function TimeRangeControls({
  preset,
  custom,
  onPreset,
  onCustom,
}: {
  preset: RangePreset;
  custom: CustomRange;
  onPreset: (p: RangePreset) => void;
  onCustom: (c: CustomRange) => void;
}) {
  return (
    <div className="range">
      <div className="seg" role="group" aria-label="Zakres czasu">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`seg-btn${preset === p.id ? " seg-on" : ""}`}
            aria-pressed={preset === p.id}
            onClick={() => onPreset(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <form className="range-inputs" onSubmit={(e) => e.preventDefault()}>
          <label>
            Od
            <input
              type="datetime-local"
              value={custom.from}
              onChange={(e) => onCustom({ ...custom, from: e.target.value })}
            />
          </label>
          <label>
            Do
            <input
              type="datetime-local"
              value={custom.to}
              onChange={(e) => onCustom({ ...custom, to: e.target.value })}
            />
          </label>
        </form>
      )}
    </div>
  );
}
