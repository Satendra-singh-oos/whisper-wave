import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, { message: "Username Must Be Atleast 3 charcters" })
  .max(25, { message: "Username Must Be Less Then 25 Characters" })
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contains special character");

export const signUpSchemaValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(5, { message: "Password Must Be Atleast 6 charcters" })
    .max(25, { message: "Password Must Be Less Then 25 Characters" }),
});
