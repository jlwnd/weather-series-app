import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import helmet from "@fastify/helmet";
import fastifyStatic from "@fastify/static";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { ensureAdmin } from "./bootstrap.ts";
import { registerErrorHandling } from "./lib/problem.ts";
import healthRoutes from "./routes/health.ts";
import authRoutes from "./routes/auth.ts";
import seriesRoutes from "./routes/series.ts";
import sensorsRoutes from "./routes/sensors.ts";
import measurementsRoutes from "./routes/measurements.ts";

const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.removeContentTypeParser("text/plain");

app.addHook("onRequest", (req, reply, done) => {
  const accept = req.headers.accept;
  if (
    req.url.startsWith("/api") &&
    accept &&
    !/\*\/\*|application\/(json|problem\+json)/.test(accept)
  ) {
    reply.code(406).type("application/problem+json").send({
      type: "about:blank",
      title: "Not Acceptable",
      status: 406,
    });
    return;
  }
  done();
});

await app.register(helmet);

registerErrorHandling(app);

await app.register(healthRoutes);
await app.register(authRoutes);
await app.register(seriesRoutes);
await app.register(sensorsRoutes);
await app.register(measurementsRoutes);

const frontendDist = fileURLToPath(
  new URL("../../frontend/dist", import.meta.url),
);
if (existsSync(frontendDist)) {
  await app.register(fastifyStatic, { root: frontendDist });
}

await ensureAdmin();

const port = Number(process.env.PORT ?? 3000);
await app.listen({ port, host: "0.0.0.0" });
