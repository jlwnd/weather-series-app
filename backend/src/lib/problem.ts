import type { FastifyInstance, FastifyReply, FastifyError } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

export interface FieldError {
  field: string;
  message: string;
}

const TITLES: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Entity",
  500: "Internal Server Error",
};

export class ProblemError extends Error {
  status: number;
  title: string;
  detail?: string;

  constructor(status: number, detail?: string) {
    super(detail ?? TITLES[status] ?? "Error");
    this.status = status;
    this.title = TITLES[status] ?? "Error";
    this.detail = detail;
  }
}

export const unauthorized = (detail?: string) => new ProblemError(401, detail);
export const forbidden = (detail?: string) => new ProblemError(403, detail);
export const notFound = (detail?: string) => new ProblemError(404, detail);
export const conflict = (detail?: string) => new ProblemError(409, detail);
export const unprocessable = (detail?: string) => new ProblemError(422, detail);

function sendProblem(
  reply: FastifyReply,
  p: { status: number; title: string; detail?: string; errors?: FieldError[] },
  instance?: string,
) {
  const body: Record<string, unknown> = {
    type: "about:blank",
    title: p.title,
    status: p.status,
  };
  if (p.detail) body.detail = p.detail;
  if (instance) body.instance = instance;
  if (p.errors) body.errors = p.errors;
  reply.code(p.status).type("application/problem+json").send(body);
}

export function registerErrorHandling(app: FastifyInstance) {
  app.setNotFoundHandler((req, reply) => {
    sendProblem(
      reply,
      { status: 404, title: TITLES[404]!, detail: "Resource not found" },
      req.url,
    );
  });

  app.setErrorHandler((err: FastifyError, req, reply) => {
    if (err instanceof ProblemError) {
      return sendProblem(reply, err, req.url);
    }
    if (hasZodFastifySchemaValidationErrors(err)) {
      const errors: FieldError[] = err.validation.map((e) => ({
        field: e.instancePath.replace(/^\//, "") || "body",
        message: e.message ?? "invalid",
      }));
      return sendProblem(
        reply,
        {
          status: 400,
          title: TITLES[400]!,
          detail: "Request validation failed",
          errors,
        },
        req.url,
      );
    }
    const status =
      err.statusCode && err.statusCode < 500 ? err.statusCode : 500;
    if (status >= 500) req.log.error(err);
    sendProblem(
      reply,
      {
        status,
        title: TITLES[status] ?? "Error",
        detail: status >= 500 ? undefined : err.message,
      },
      req.url,
    );
  });
}
