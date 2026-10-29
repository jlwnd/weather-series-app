import { useQuery } from "@tanstack/react-query";
import { getSeries } from "../queries/series";

export const useSeries = () =>
  useQuery({ queryKey: ["series"], queryFn: getSeries });
