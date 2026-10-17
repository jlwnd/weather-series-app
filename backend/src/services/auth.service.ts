import * as argon2 from "argon2";
import { adminRepository } from "../repositories/admin.repository.ts";
import { sessionRepository } from "../repositories/session.repository.ts";
import { randomToken, sha256 } from "../lib/crypto.ts";

const TOKEN_TTL_SECONDS = 86_400; // 24h

export interface AuthToken {
  token: string;
  expiresIn: number;
}

export const authService = {
  async login(username: string, password: string): Promise<AuthToken | null> {
    const admin = await adminRepository.findByUsername(username);
    if (!admin) return null;
    const passwordMatches = await argon2.verify(admin.passwordHash, password);
    if (!passwordMatches) return null;
    const token = randomToken();
    const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000);
    await sessionRepository.create(sha256(token), admin.id, expiresAt);
    return { token, expiresIn: TOKEN_TTL_SECONDS };
  },

  async logout(token: string): Promise<void> {
    await sessionRepository.deleteByTokenHash(sha256(token));
  },

  async verifyToken(token: string): Promise<number | null> {
    const session = await sessionRepository.findByTokenHash(sha256(token));
    if (!session) return null;
    if (session.expiresAt.getTime() <= Date.now()) {
      await sessionRepository.deleteByTokenHash(session.tokenHash);
      return null;
    }
    return session.adminId;
  },

  async changePassword(
    adminId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const admin = await adminRepository.findById(adminId);
    if (!admin) return false;
    const passwordMatches = await argon2.verify(
      admin.passwordHash,
      currentPassword,
    );
    if (!passwordMatches) return false;
    await adminRepository.updatePassword(
      adminId,
      await argon2.hash(newPassword),
    );
    return true;
  },
};
