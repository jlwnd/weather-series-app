import type { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "../services/auth.service.ts";

declare module "fastify" {
  interface FastifyRequest {
    admin?: { adminId: number; token: string };
  }
}

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const adminId = token ? await authService.verifyToken(token) : null;
  if (adminId === null) {
    return reply.code(401).send({ message: "Invalid or expired token" });
  }
  req.admin = { adminId, token: token! };
}
