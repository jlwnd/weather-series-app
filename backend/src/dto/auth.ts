import { z } from "zod";

export const LoginDto = z.object({
  username: z.string(),
  password: z.string(),
});

export const LoginResponseDto = z.object({
  accessToken: z.string(),
  tokenType: z.literal("Bearer"),
  expiresIn: z.number().int(),
});

export const PasswordChangeDto = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});
