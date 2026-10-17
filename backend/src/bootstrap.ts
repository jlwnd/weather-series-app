import * as argon2 from "argon2";
import { adminRepository } from "./repositories/admin.repository.ts";

export async function ensureAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return;
  const existing = await adminRepository.findByUsername(username);
  if (existing) return;
  await adminRepository.insert(username, await argon2.hash(password));
}
