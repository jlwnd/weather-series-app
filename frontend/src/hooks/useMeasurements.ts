import { useQuery } from "@tanstack/react-query";
import { getMeasurements } from "../queries/measurements";
import { useSeries } from "./useSeries";

// Measurements for all current series — derives the ids itself; the underlying
// useSeries call is deduped by react-query against the one in the component tree.
export function useMeasurements() {
  const { data: series = [] } = useSeries();
  const seriesIds = series.map((s) => s.id);
  return useQuery({
    queryKey: ["measurements", seriesIds],
    queryFn: () => getMeasurements({ seriesIds, limit: 10000 }),
    enabled: seriesIds.length > 0,
  });
}
