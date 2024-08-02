import { z } from "zod";

export const registerSchema = z.object({
    username: z
      .string()
      .min(1, { message: "Username is required" })
      .max(15, { message: "Username is too long" }),
    email: z.string().email({ message: "Invalid email" }).min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  });