import { useQuery } from "@tanstack/react-query";
import { getMeasurements } from "../queries/measurements";
import { useSeries } from "./useSeries";

export function useMeasurements(from?: string, to?: string, enabled = true) {
  const { data: series = [] } = useSeries();
  const seriesIds = series.map((s) => s.id);
  return useQuery({
    queryKey: ["measurements", seriesIds, from, to],
    queryFn: () => getMeasurements({ seriesIds, from, to, limit: 10000 }),
    enabled: enabled && seriesIds.length > 0,
  });
}
