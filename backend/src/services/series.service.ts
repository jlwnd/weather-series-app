import { seriesRepository } from "../repositories/series.repository.ts";
import { unprocessable } from "../lib/problem.ts";
import type { Series } from "../db/schema.ts";

type SeriesInput = Omit<Series, "id">;

const assertRange = (input: SeriesInput): void => {
  if (input.minValue >= input.maxValue)
    throw unprocessable("minValue must be less than maxValue");
};

export const seriesService = {
  list: (): Promise<Series[]> => seriesRepository.findAll(),

  getById: (id: number): Promise<Series | undefined> =>
    seriesRepository.findById(id),

  create: (input: SeriesInput): Promise<Series> => {
    assertRange(input);
    return seriesRepository.insert(input);
  },

  update: (id: number, input: SeriesInput): Promise<Series | undefined> => {
    assertRange(input);
    // ponytail: 409 gdy nowy przedział wyklucza istniejące wyniki — dopięte, gdy powstanie tabela measurements
    return seriesRepository.update(id, input);
  },

  delete: (id: number): Promise<boolean> => seriesRepository.delete(id),
};
