import { useQuery } from "@tanstack/react-query";
import { getMeasurements } from "../queries/measurements";
import { useSeries } from "./useSeries";

export function useLatestTimestamp() {
  const { data: series = [] } = useSeries();
  const seriesIds = series.map((s) => s.id);
  return useQuery({
    queryKey: ["latest-timestamp", seriesIds],
    queryFn: async () => {
      const [m] = await getMeasurements({
        seriesIds,
        sort: "-timestamp",
        limit: 1,
      });
      return m ? Date.parse(m.timestamp) : 0;
    },
    enabled: seriesIds.length > 0,
  });
}
