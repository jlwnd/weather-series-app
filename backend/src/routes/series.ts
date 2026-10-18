import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { requireAdmin } from "../lib/auth.ts";
import { seriesService } from "../services/series.service.ts";
import { SeriesInputDto, SeriesDto, SeriesParamsDto } from "../dto/series.ts";
import { ProblemDto } from "../dto/common.ts";
import { notFound } from "../lib/problem.ts";

export default async function seriesRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get(
    "/api/series",
    { schema: { response: { 200: z.array(SeriesDto) } } },
    async () => seriesService.list(),
  );

  r.get(
    "/api/series/:seriesId",
    {
      schema: {
        params: SeriesParamsDto,
        response: { 200: SeriesDto, 404: ProblemDto },
      },
    },
    async (req) => {
      const found = await seriesService.getById(req.params.seriesId);
      if (!found) throw notFound("Series not found");
      return found;
    },
  );

  r.post(
    "/api/series",
    {
      onRequest: requireAdmin,
      schema: {
        body: SeriesInputDto,
        response: { 201: SeriesDto, 401: ProblemDto, 422: ProblemDto },
      },
    },
    async (req, reply) => {
      const created = await seriesService.create(req.body);
      return reply
        .code(201)
        .header("Location", `/api/series/${created.id}`)
        .send(created);
    },
  );

  r.put(
    "/api/series/:seriesId",
    {
      onRequest: requireAdmin,
      schema: {
        params: SeriesParamsDto,
        body: SeriesInputDto,
        response: {
          200: SeriesDto,
          401: ProblemDto,
          404: ProblemDto,
          422: ProblemDto,
        },
      },
    },
    async (req) => {
      const updated = await seriesService.update(req.params.seriesId, req.body);
      if (!updated) throw notFound("Series not found");
      return updated;
    },
  );

  r.delete(
    "/api/series/:seriesId",
    { onRequest: requireAdmin, schema: { params: SeriesParamsDto } },
    async (req, reply) => {
      const deleted = await seriesService.delete(req.params.seriesId);
      if (!deleted) throw notFound("Series not found");
      return reply.code(204).send();
    },
  );
}
