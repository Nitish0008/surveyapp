import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, 'Enter your official email or employee code'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, 'Enter your registered email or employee code'),
});
