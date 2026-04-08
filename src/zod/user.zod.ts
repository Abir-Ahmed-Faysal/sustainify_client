import { z } from "zod";

// ─── Admin User Management Schemas ───────────────────────────────────────

// Admin: Toggle user active status
export const toggleUserStatusSchema = z.object({
  isActive: z.boolean(),
});

// Admin: Change user role
export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"], {
    message: "Role must be ADMIN or MEMBER",
  }),
});

// Member: Update own profile
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  avatar: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  address: z.string().optional(),
});

export type IToggleUserStatus = z.infer<typeof toggleUserStatusSchema>;
export type IUpdateUserRole = z.infer<typeof updateUserRoleSchema>;
export type IUpdateProfile = z.infer<typeof updateProfileSchema>;

export const userValidationSchemas = {
  toggleUserStatusSchema,
  updateUserRoleSchema,
  updateProfileSchema,
};
