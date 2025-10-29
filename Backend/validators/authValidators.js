import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Password must include uppercase, lowercase, and a number'),
  role: z.enum(['student', 'alumni', 'teacher' ,'admin']).optional(),
  college: z.string().min(2),
  degree: z.string().min(2),
  graduationYear: z.number().int().min(1900).max(2100),

  // Optional fields
  profilePicture: z.string().refine(
    (val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid URL format" }
  ).optional(),
  phone: z.string().optional(),
  linkedin: z.string().url().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
