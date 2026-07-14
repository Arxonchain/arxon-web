import { z } from "zod";

// Waitlist validation schema
export const waitlistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
});

// Auth validation schemas
export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const adminSignupSchema = authSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(100, "Name must be less than 100 characters"),
  organization: z
    .string()
    .trim()
    .max(120, "Organization must be less than 120 characters")
    .optional()
    .or(z.literal("")),
  reason: z
    .string()
    .trim()
    .min(10, "Please explain why you need admin access")
    .max(500, "Reason must be less than 500 characters"),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;
export type AuthFormData = z.infer<typeof authSchema>;
export type AdminSignupFormData = z.infer<typeof adminSignupSchema>;
