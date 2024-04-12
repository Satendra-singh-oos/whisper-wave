import { z } from "zod";

export const acceptSchemaValidation = z.object({
  acceptMessage: z.boolean(),
});
