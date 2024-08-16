import { z } from "zod";

export const loginDataResponseSchema = z.object({
  username: z.string(),
  name: z.string(),
  role: z.string(),
  id: z.number(),
});

export type LoginDataResponse = z.infer<typeof loginDataResponseSchema>;

export const LoginFormInputSchema = z.object({
  username: z.string().min(2, { message: "Minimal 2 huruf" }),
  password: z.string().min(2, { message: "Minimal 2 huruf" }),
});

export type LoginFormInput = z.infer<typeof LoginFormInputSchema>;
