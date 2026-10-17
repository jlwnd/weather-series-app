import { eq } from "drizzle-orm";
import { db } from "../db/client.ts";
import { admins, type Admin } from "../db/schema.ts";

export const adminRepository = {
  findByUsername: (username: string): Promise<Admin | undefined> =>
    db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .then((rows) => rows[0]),

  findById: (id: number): Promise<Admin | undefined> =>
    db
      .select()
      .from(admins)
      .where(eq(admins.id, id))
      .then((rows) => rows[0]),

  insert: async (username: string, passwordHash: string): Promise<void> => {
    await db.insert(admins).values({ username, passwordHash });
  },

  updatePassword: async (id: number, passwordHash: string): Promise<void> => {
    await db.update(admins).set({ passwordHash }).where(eq(admins.id, id));
  },
};
