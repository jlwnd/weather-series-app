import { seriesRepository } from "../repositories/series.repository.ts";
import { measurementsRepository } from "../repositories/measurements.repository.ts";
import { conflict, unprocessable } from "../lib/problem.ts";
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

  update: async (
    id: number,
    input: SeriesInput,
  ): Promise<Series | undefined> => {
    assertRange(input);
    if (
      await measurementsRepository.existsOutsideRange(
        id,
        input.minValue,
        input.maxValue,
      )
    )
      throw conflict("New range excludes existing measurements");
    return seriesRepository.update(id, input);
  },

  delete: (id: number): Promise<boolean> => seriesRepository.delete(id),
};
