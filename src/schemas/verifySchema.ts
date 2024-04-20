import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const verifySchemaValidation = z.object({
  code: z.string().length(6, { message: "Verification Code Must Be  6 Digit" }),
  username: usernameValidation,
});
