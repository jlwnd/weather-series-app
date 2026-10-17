import { eq } from "drizzle-orm";
import { db } from "../db/client.ts";
import { sessions, type Session } from "../db/schema.ts";

export const sessionRepository = {
  create: async (
    tokenHash: string,
    adminId: number,
    expiresAt: Date,
  ): Promise<void> => {
    await db.insert(sessions).values({ tokenHash, adminId, expiresAt });
  },

  findByTokenHash: (tokenHash: string): Promise<Session | undefined> =>
    db
      .select()
      .from(sessions)
      .where(eq(sessions.tokenHash, tokenHash))
      .then((rows) => rows[0]),

  deleteByTokenHash: async (tokenHash: string): Promise<void> => {
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
  },
};
