import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { requireAdmin } from "../lib/auth.ts";
import { seriesRepository } from "../repositories/series.repository.ts";
import { SeriesInputDto, SeriesDto, SeriesParamsDto } from "../dto/series.ts";
import { ErrorDto } from "../dto/common.ts";

export default async function seriesRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get(
    "/api/series",
    { schema: { response: { 200: z.array(SeriesDto) } } },
    async () => seriesRepository.findAll(),
  );

  r.get(
    "/api/series/:seriesId",
    { schema: { params: SeriesParamsDto, response: { 200: SeriesDto, 404: ErrorDto } } },
    async (req, reply) => {
      const found = await seriesRepository.findById(req.params.seriesId);
      if (!found) return reply.code(404).send({ message: "Series not found" });
      return found;
    },
  );

  r.post(
    "/api/series",
    { schema: { body: SeriesInputDto, response: { 201: SeriesDto, 422: ErrorDto } } },
    async (req, reply) => {
      if (req.body.minValue >= req.body.maxValue)
        return reply.code(422).send({ message: "minValue must be less than maxValue" });
      const auth = await requireAdmin(req, reply);
      if (!auth) return;
      const created = await seriesRepository.insert(req.body);
      return reply.code(201).header("Location", `/api/series/${created.id}`).send(created);
    },
  );

  r.put(
    "/api/series/:seriesId",
    {
      schema: {
        params: SeriesParamsDto,
        body: SeriesInputDto,
        response: { 200: SeriesDto, 404: ErrorDto, 422: ErrorDto },
      },
    },
    async (req, reply) => {
      if (req.body.minValue >= req.body.maxValue)
        return reply.code(422).send({ message: "minValue must be less than maxValue" });
      const auth = await requireAdmin(req, reply);
      if (!auth) return;
      // ponytail: 409 gdy nowy przedział wyklucza istniejące wyniki — dopięte, gdy powstanie tabela measurements
      const updated = await seriesRepository.update(req.params.seriesId, req.body);
      if (!updated) return reply.code(404).send({ message: "Series not found" });
      return updated;
    },
  );

  r.delete(
    "/api/series/:seriesId",
    { schema: { params: SeriesParamsDto } },
    async (req, reply) => {
      const auth = await requireAdmin(req, reply);
      if (!auth) return;
      const deleted = await seriesRepository.delete(req.params.seriesId);
      if (!deleted) return reply.code(404).send({ message: "Series not found" });
      return reply.code(204).send();
    },
  );
}
