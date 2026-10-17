import type { FastifyRequest } from "fastify";
import { authService } from "../services/auth.service.ts";
import { unauthorized } from "./problem.ts";

declare module "fastify" {
  interface FastifyRequest {
    admin?: { adminId: number; token: string };
  }
}

export async function requireAdmin(req: FastifyRequest) {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const adminId = token ? await authService.verifyToken(token) : null;
  if (adminId === null) throw unauthorized("Invalid or expired token");
  req.admin = { adminId, token: token! };
}
