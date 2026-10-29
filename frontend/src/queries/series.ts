import type { Series, SeriesInput } from "../types";
import { get, send } from "./client";

export const getSeries = () => get<Series[]>("/api/series");

export const createSeries = (token: string, input: SeriesInput) =>
  send<Series>("POST", "/api/series", { token, body: input });

export const updateSeries = (token: string, id: number, input: SeriesInput) =>
  send<Series>("PUT", `/api/series/${id}`, { token, body: input });

export const deleteSeries = (token: string, id: number) =>
  send<null>("DELETE", `/api/series/${id}`, { token });
