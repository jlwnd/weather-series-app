import { z } from "zod";

export const ProblemDto = z.object({
  type: z.string().default("about:blank"),
  title: z.string(),
  status: z.number().int(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  errors: z
    .array(z.object({ field: z.string(), message: z.string() }))
    .optional(),
});
