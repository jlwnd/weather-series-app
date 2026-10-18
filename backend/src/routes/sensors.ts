import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { requireAdmin } from "../lib/auth.ts";
import { generateApiKey, sha256 } from "../lib/crypto.ts";
import { sensorsRepository } from "../repositories/sensors.repository.ts";
import { seriesRepository } from "../repositories/series.repository.ts";
import {
  SensorInputDto,
  SensorDto,
  SensorCreatedDto,
  SensorParamsDto,
} from "../dto/sensors.ts";
import { ProblemDto } from "../dto/common.ts";
import { notFound, unprocessable } from "../lib/problem.ts";

export default async function sensorsRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get(
    "/api/sensors",
    {
      onRequest: requireAdmin,
      schema: { response: { 200: z.array(SensorDto), 401: ProblemDto } },
    },
    async () => sensorsRepository.findAll(),
  );

  r.get(
    "/api/sensors/:sensorId",
    {
      onRequest: requireAdmin,
      schema: {
        params: SensorParamsDto,
        response: { 200: SensorDto, 401: ProblemDto, 404: ProblemDto },
      },
    },
    async (req) => {
      const found = await sensorsRepository.findById(req.params.sensorId);
      if (!found) throw notFound("Sensor not found");
      return found;
    },
  );

  r.post(
    "/api/sensors",
    {
      onRequest: requireAdmin,
      schema: {
        body: SensorInputDto,
        response: { 201: SensorCreatedDto, 401: ProblemDto, 422: ProblemDto },
      },
    },
    async (req, reply) => {
      const seriesExists = await seriesRepository.findById(req.body.seriesId);
      if (!seriesExists) throw unprocessable("Series does not exist");
      const apiKey = generateApiKey();
      const created = await sensorsRepository.insert({
        name: req.body.name,
        seriesId: req.body.seriesId,
        apiKeyHash: sha256(apiKey),
      });
      return reply
        .code(201)
        .header("Location", `/api/sensors/${created.id}`)
        .send({ ...created, apiKey });
    },
  );

  r.delete(
    "/api/sensors/:sensorId",
    { onRequest: requireAdmin, schema: { params: SensorParamsDto } },
    async (req, reply) => {
      const deleted = await sensorsRepository.delete(req.params.sensorId);
      if (!deleted) throw notFound("Sensor not found");
      return reply.code(204).send();
    },
  );
}
