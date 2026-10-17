import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { ensureAdmin } from "./bootstrap.ts";
import healthRoutes from "./routes/health.ts";
import authRoutes from "./routes/auth.ts";
import seriesRoutes from "./routes/series.ts";

const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(healthRoutes);
await app.register(authRoutes);
await app.register(seriesRoutes);

await ensureAdmin();

const port = Number(process.env.PORT ?? 3000);
await app.listen({ port, host: "0.0.0.0" });
