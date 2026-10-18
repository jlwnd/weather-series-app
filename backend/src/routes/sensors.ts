import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { requireAdmin } from "../lib/auth.ts";
import { sensorsService } from "../services/sensors.service.ts";
import {
  SensorInputDto,
  SensorDto,
  SensorCreatedDto,
  SensorParamsDto,
} from "../dto/sensors.ts";
import { ProblemDto } from "../dto/common.ts";
import { notFound } from "../lib/problem.ts";

export default async function sensorsRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get(
    "/api/sensors",
    {
      onRequest: requireAdmin,
      schema: { response: { 200: z.array(SensorDto), 401: ProblemDto } },
    },
    async () => sensorsService.list(),
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
      const found = await sensorsService.getById(req.params.sensorId);
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
      const created = await sensorsService.create(
        req.body.name,
        req.body.seriesId,
      );
      return reply
        .code(201)
        .header("Location", `/api/sensors/${created.id}`)
        .send(created);
    },
  );

  r.delete(
    "/api/sensors/:sensorId",
    { onRequest: requireAdmin, schema: { params: SensorParamsDto } },
    async (req, reply) => {
      const deleted = await sensorsService.delete(req.params.sensorId);
      if (!deleted) throw notFound("Sensor not found");
      return reply.code(204).send();
    },
  );
}
