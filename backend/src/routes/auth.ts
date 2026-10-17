import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { requireAdmin } from "../lib/auth.ts";
import { authService } from "../services/auth.service.ts";
import { LoginDto, LoginResponseDto, PasswordChangeDto } from "../dto/auth.ts";
import { ProblemDto } from "../dto/common.ts";
import { unauthorized, forbidden } from "../lib/problem.ts";

export default async function authRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.post(
    "/api/auth/login",
    {
      schema: {
        body: LoginDto,
        response: { 200: LoginResponseDto, 401: ProblemDto },
      },
    },
    async (req, reply) => {
      const result = await authService.login(
        req.body.username,
        req.body.password,
      );
      if (!result) throw unauthorized("Invalid username or password");
      return reply.code(200).send({
        accessToken: result.token,
        tokenType: "Bearer",
        expiresIn: result.expiresIn,
      });
    },
  );

  r.post(
    "/api/auth/logout",
    { onRequest: requireAdmin },
    async (req, reply) => {
      await authService.logout(req.admin!.token);
      return reply.code(204).send();
    },
  );

  r.put(
    "/api/auth/password",
    { onRequest: requireAdmin, schema: { body: PasswordChangeDto } },
    async (req, reply) => {
      const ok = await authService.changePassword(
        req.admin!.adminId,
        req.body.currentPassword,
        req.body.newPassword,
      );
      if (!ok) throw forbidden("Current password is incorrect");
      return reply.code(204).send();
    },
  );
}
