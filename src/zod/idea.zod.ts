import { z } from "zod";

// Vote validation schema
export const voteZodSchema = z.object({
  ideaId: z.string("Invalid Idea ID format").uuid(),
  type: z.enum(["UP", "DOWN"]).describe("Vote type must be UP or DOWN"),
});

export type IVote = z.infer<typeof voteZodSchema>;

// Comment validation schema
export const createCommentZodSchema = z.object({
  content: z
    .string("Content is required")
    .min(1, "Content cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
  ideaId: z.string("Idea ID is required").uuid("Invalid Idea ID format"),
  parentId: z.string().uuid().optional(),
});

export const updateCommentZodSchema = z.object({
  content: z
    .string("Content is required")
    .min(1, "Content cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export type ICreateComment = z.infer<typeof createCommentZodSchema>;
export type IUpdateComment = z.infer<typeof updateCommentZodSchema>;

export const validationSchemas = {
  voteZodSchema,
  createCommentZodSchema,
  updateCommentZodSchema,
};
