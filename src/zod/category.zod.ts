import { z } from "zod";

// Create category validation schema - mirrors backend validation
export const createCategoryZodSchema = z.object({
    name: z
        .string("Name is required")
        .min(3, "Name must be at least 3 characters long"),
    image: z
        .string()
        .url("Image must be a valid URL")
        .optional()
        .or(z.literal("")),
});

// Update category validation schema - mirrors backend validation
export const updateCategoryZodSchema = z.object({
    name: z
        .string("Name is required")
        .min(3, "Name must be at least 3 characters long")
        .optional(),
    image: z
        .string()
        .url("Invalid URL")
        .optional()
        .or(z.literal("")),
});

export type ICreateCategory = z.infer<typeof createCategoryZodSchema>;
export type IUpdateCategory = z.infer<typeof updateCategoryZodSchema>;

export const categoryValidation = {
    createCategoryZodSchema,
    updateCategoryZodSchema,
};
