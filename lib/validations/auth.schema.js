import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .preprocess(
      (val) => (val === undefined ? "" : val),
      z
        .string()
        .min(1, "Username is required")
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, {
          message: "Username can only contain letters, numbers, and _",
        })
    ),

  email: z
    .preprocess(
      (val) => (val === undefined ? "" : val),
      z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address")
    ),

  password: z
    .preprocess(
      (val) => (val === undefined ? "" : val),
      z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
          /[^A-Za-z0-9]/,
          "Password must contain at least one special character"
        )
    ),
});
