import { z } from "zod";

export const verifySchemaValidation = z.object({
  code: z.string().length(6, { message: "Verification Code Must Be  6 Digit" }),
});
