import { randomBytes, createHash } from "node:crypto";

export const sha256 = (value: string): string =>
  createHash("sha256").update(value).digest("hex");

export const randomToken = (): string => randomBytes(32).toString("hex");

export const generateApiKey = (): string =>
  randomBytes(32).toString("base64url");
