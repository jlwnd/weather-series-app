import { z } from "zod";

export const ErrorDto = z.object({
  message: z.string(),
});
