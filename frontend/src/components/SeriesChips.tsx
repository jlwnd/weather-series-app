import type { Series } from "../types";

export function SeriesChips({
  series,
  hidden,
  onToggle,
}: {
  series: Series[];
  hidden: Set<number>;
  onToggle: (id: number) => void;
}) {
  return (
    <fieldset className="chips">
      <legend className="chips-legend">Serie</legend>
      {series.map((s) => {
        const on = !hidden.has(s.id);
        return (
          <button
            key={s.id}
            type="button"
            className={`chip${on ? " chip-on" : ""}`}
            aria-pressed={on}
            onClick={() => onToggle(s.id)}
          >
            <span
              className="chip-swatch"
              style={{ background: s.color }}
              aria-hidden="true"
            />
            {s.name}
          </button>
        );
      })}
    </fieldset>
  );
}
