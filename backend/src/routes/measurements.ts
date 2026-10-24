import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { requireSensor } from "../lib/auth.ts";
import { measurementsService } from "../services/measurements.service.ts";
import {
  MeasurementInputDto,
  MeasurementDto,
  MeasurementQueryDto,
  MeasurementParamsDto,
} from "../dto/measurements.ts";
import { ProblemDto } from "../dto/common.ts";
import { notFound } from "../lib/problem.ts";

export default async function measurementsRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get(
    "/api/measurements",
    {
      schema: {
        querystring: MeasurementQueryDto,
        response: { 200: z.array(MeasurementDto), 400: ProblemDto },
      },
    },
    async (req) => measurementsService.list(req.query),
  );

  r.get(
    "/api/measurements/:measurementId",
    {
      schema: {
        params: MeasurementParamsDto,
        response: { 200: MeasurementDto, 404: ProblemDto },
      },
    },
    async (req) => {
      const found = await measurementsService.getById(req.params.measurementId);
      if (!found) throw notFound("Measurement not found");
      return found;
    },
  );

  r.post(
    "/api/measurements",
    {
      onRequest: requireSensor,
      schema: {
        body: MeasurementInputDto,
        response: {
          201: MeasurementDto,
          401: ProblemDto,
          422: ProblemDto,
        },
      },
    },
    async (req, reply) => {
      const created = await measurementsService.create(
        req.sensor!,
        req.body.value,
        req.body.timestamp,
      );
      return reply
        .code(201)
        .header("Location", `/api/measurements/${created.id}`)
        .send(created);
    },
  );
}
