import { z } from "zod";

export const messageSchemaValidation = z.object({
  content: z
    .string()
    .min(10, { message: "Content Must Be Atleast Of 10 Char" })
    .max(300, { message: "Content Must Be Less Then 300 Char" }),
});
