import z from "zod";

const UserRegistrationZodSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .max(20),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be minimum 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character"),
});

const UserEmailVerifyZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6),
});

const LoginZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be minimum 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character"),
});

const ForgotPasswordZodSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ResetPasswordZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  newPassword: z
    .string()
    .min(8, "Password must be minimum 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character"),
  otp: z.string().length(6),
});

export const authValidation = {
  UserRegistrationZodSchema,
  UserEmailVerifyZodSchema,
  LoginZodSchema,
  ForgotPasswordZodSchema,
  ResetPasswordZodSchema,
};