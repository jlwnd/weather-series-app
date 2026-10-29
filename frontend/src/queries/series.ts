import type { Series } from "../types";
import { get } from "./client";

export const getSeries = () => get<Series[]>("/api/series");
