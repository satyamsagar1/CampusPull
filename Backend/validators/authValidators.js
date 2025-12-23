import { z } from 'zod';

export const signupSchema = z.object({
  // --- 1. Identity & Auth ---
  name: z.string()
    .trim()
    .min(2, "Name is too short")
    .max(80, "Name is too long"),
  email: z.string()
    .trim()
    .email("Invalid email format")
    .lowercase(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password needs at least one uppercase letter")
    .regex(/[0-9]/, "Password needs at least one number"),
  role: z.enum(['student', 'alumni', 'teacher', 'admin'], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),

  // --- 2. Common Academic Info ---
  college: z.string().min(1, "College name is required").default("ABESIT"),
  department: z.string().min(1, "Department is required"),

  // --- 3. Conditional Fields (Refined below) ---
  degree: z.string().trim().optional(),
  
  // Professional Year Handling: Restricted to 1-4
  year: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(1, "Year must be at least 1").max(4, "Year cannot be greater than 4").optional()
  ),
  
  graduationYear: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(1900).max(2100).optional()
  ),
  
  section: z.string().trim().optional(),
  designation: z.string().trim().optional(),
  currentCompany: z.string().trim().optional(),

  // --- 4. Profile Details ---
  phone: z.string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
    .optional()
    .or(z.literal('')),
    
  bio: z.string()
    .max(500, "Bio is limited to 500 characters")
    .optional()
    .or(z.literal('')),

  skills: z.array(z.string()).default([]),

  // Social Links with professional URL validation
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
  portfolio: z.string().url("Invalid Portfolio URL").optional().or(z.literal('')),
  leetcode: z.string().url("Invalid LeetCode URL").optional().or(z.literal('')),
  
}).refine((data) => {
  // PROFESSIONAL GUARD: If student, require year and section
  if (data.role === 'student') {
    return !!data.year && !!data.section;
  }
  return true;
}, {
  message: "Students must provide both Year and Section",
  path: ["year"], // Points the error to the year field
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format").lowercase(),
  password: z.string().min(1, "Password is required"),
});