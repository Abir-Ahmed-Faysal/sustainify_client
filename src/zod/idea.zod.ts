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

// ─── Idea Schemas (mirrors server-side validation exactly) ───────────────────

// Matches server: createIdeaZodSchema
// status is optional and only "DRAFT" is permitted at creation time
export const createIdeaZodSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),

  problemStatement: z
    .string()
    .min(10, { message: "Problem statement must be at least 10 characters" }),

  solution: z
    .string()
    .min(10, { message: "Solution must be at least 10 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),

  image: z
    .string()
    .url({ message: "Image must be a valid URL" })
    .optional()
    .or(z.literal("")),

  price: z.coerce
    .number()
    .positive({ message: "Price must be greater than 0" })
    .optional(),

  attachments: z.array(z.string().url()).optional(),

  categoryId: z.string().uuid({ message: "Invalid category ID" }),

  // Only DRAFT is allowed at creation; omitting sends no status (server defaults)
  status: z.enum(["DRAFT"]).optional(),
});

// Matches server: updateIdeaZodSchema
// ⚠️ status / feedback / isFeatured are NOT here — those are separate
// server endpoints (updateIdeaStatus / updateIdeaStatusByAdmin / toggleIsFeatured)
export const updateIdeaZodSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .optional(),

  problemStatement: z
    .string()
    .min(10, { message: "Problem statement must be at least 10 characters" })
    .optional(),

  solution: z
    .string()
    .min(10, { message: "Solution must be at least 10 characters" })
    .optional(),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .optional(),

  image: z
    .string()
    .url({ message: "Image must be a valid URL" })
    .optional()
    .or(z.literal("")),

  price: z.coerce
    .number()
    .positive({ message: "Price must be greater than 0" })
    .optional(),

  attachments: z.array(z.string().url()).optional(),

  categoryId: z.string().uuid({ message: "Invalid category ID" }).optional(),
});

// Matches server: updateIdeaStatus schema (member-facing status transitions only)
// DRAFT → UNDER_REVIEW (submit for review) or UNDER_REVIEW → DRAFT (retract)
export const updateIdeaStatusSchema = z.object({
  status: z.enum(["DRAFT", "UNDER_REVIEW"], {
    message: "Status must be DRAFT or UNDER_REVIEW",
  }),
});

// ─── Admin Schemas ───────────────────────────────────────────────────────────

// Admin: Toggle isFeatured status
export const toggleIsFeaturedSchema = z.object({
  isFeatured: z.boolean(),
});

// Admin: Update idea status with optional feedback
// Feedback is required when status is REJECTED
export const updateIdeaStatusByAdminSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED", "UNDER_REVIEW"], {
      message: "Status must be APPROVED, REJECTED, or UNDER_REVIEW",
    }),
    feedback: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === "REJECTED") {
        return !!data.feedback && data.feedback.trim() !== "";
      }
      return true;
    },
    {
      message: "Feedback is required when rejecting an idea",
      path: ["feedback"],
    }
  );

export type ICreateIdea = z.infer<typeof createIdeaZodSchema>;
export type IUpdateIdea = z.infer<typeof updateIdeaZodSchema>;
export type IUpdateIdeaStatus = z.infer<typeof updateIdeaStatusSchema>;
export type IToggleFeatured = z.infer<typeof toggleIsFeaturedSchema>;
export type IUpdateIdeaStatusByAdmin = z.infer<typeof updateIdeaStatusByAdminSchema>;

export const validationSchemas = {
  voteZodSchema,
  createCommentZodSchema,
  updateCommentZodSchema,
  createIdeaZodSchema,
  updateIdeaZodSchema,
  updateIdeaStatusSchema,
  toggleIsFeaturedSchema,
  updateIdeaStatusByAdminSchema,
};
