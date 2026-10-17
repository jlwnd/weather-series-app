import type { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "../services/auth.service.ts";

export async function requireAdmin(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<{ adminId: number; token: string } | null> {
  const match = req.headers.authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    reply.code(401).send({ message: "Missing bearer token" });
    return null;
  }
  const token = match[1];
  const adminId = await authService.verifyToken(token);
  if (adminId === null) {
    reply.code(401).send({ message: "Invalid or expired token" });
    return null;
  }
  return { adminId, token };
}
