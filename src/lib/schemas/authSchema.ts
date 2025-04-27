import { z } from "zod";

// Auth Schemas
export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Minimum 6 characters" }),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(2, { message: "Name is too short" }),
});

// Profile Schema
export const profileSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  location: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
});

// Skill Post Schema
export const skillPostSchema = z.object({
  title: z.string().min(3, { message: "Title is too short" }),
  description: z.string().min(10, { message: "Description is too short" }),
  category: z.string().min(1, { message: "Category is required" }),
  image_url: z.string(),
});