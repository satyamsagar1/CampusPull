import { z } from 'zod';

export const signupSchema = z.object({
  // --- 1. Identity & Auth (Required) ---
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Password must include uppercase, lowercase, and a number')
    ,
  role: z.enum(['student', 'alumni', 'teacher', 'admin']), 

  // --- 2. Common Academic Info ---
  college: z.string().min(2, "College name is required"),
  department: z.string().min(2, "Department is required"),

  // --- 3. Conditional Fields
  degree: z.string().optional(),            
  graduationYear: z.number().optional(), 
  
  year: z.number().min(1).max(5).optional(), 
  section: z.string().optional(),            
  
  designation: z.string().optional(),    
  currentCompany: z.string().optional(),

  // --- 4. Profile Details (Optional) ---
  profileImage: z.string().url().optional().or(z.literal('')), 
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).optional(),
  
  // Social Links
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});