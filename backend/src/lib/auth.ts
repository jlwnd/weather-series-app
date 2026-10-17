import type { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "../services/auth.service.ts";

export async function requireAdmin(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<number | null> {
  const match = req.headers.authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    reply.code(401).send({ message: "Missing bearer token" });
    return null;
  }
  const adminId = await authService.verifyToken(match[1]);
  if (adminId === null) {
    reply.code(401).send({ message: "Invalid or expired token" });
    return null;
  }
  return adminId;
}
