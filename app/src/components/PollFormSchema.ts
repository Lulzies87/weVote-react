import { z } from "zod";

export const FormSchema = z.object({
  submittedVote: z.enum(["yes", "no"], {
    required_error: "You need to select Yes or No.",
  }),
});
