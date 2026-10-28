import { useCallback, useState } from "react";

// Tracks which series are toggled OFF; empty set = all visible.
export function useSeriesVisibility() {
  const [hidden, setHidden] = useState<Set<number>>(new Set());

  const toggle = useCallback((id: number) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return { hidden, toggle };
}
