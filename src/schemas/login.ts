import { z } from "zod";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(10, { message: "Username is too long" }),
  password: z.string().min(1, { message: "Password is required" }),
});
