import { z } from "zod";

// Create blog validation schema - mirrors backend validation
export const createBlogZodSchema = z.object({
  title: z
    .string("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  content: z
    .string("Content is required")
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content cannot exceed 5000 characters"),
  image: z
    .string("Image must be a valid URL")
    .optional(),
  isPublished: z.boolean().optional(),
});

// Update blog validation schema - mirrors backend validation
export const updateBlogZodSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content cannot exceed 5000 characters")
    .optional(),
  image: z
    .string("Image must be a valid URL")
    .optional(),
  isPublished: z.boolean().optional(),
});

export type ICreateBlog = z.infer<typeof createBlogZodSchema>;
export type IUpdateBlog = z.infer<typeof updateBlogZodSchema>;

export const blogValidationSchemas = {
  createBlogZodSchema,
  updateBlogZodSchema,
};
