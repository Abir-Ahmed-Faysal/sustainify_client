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

export type IToggleUserStatus = z.infer<typeof toggleUserStatusSchema>;
export type IUpdateUserRole = z.infer<typeof updateUserRoleSchema>;

export const userValidationSchemas = {
  toggleUserStatusSchema,
  updateUserRoleSchema,
};
