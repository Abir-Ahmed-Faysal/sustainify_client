import { UserRole } from "@/lib/authUtils";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string | null;
    bio?: string | null;
    location?: string | null;
    website?: string | null;
    phone?: string | null;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    profile?: {
        id: string;
        userId: string;
        bio?: string | null;
        avatar?: string | null;
        location?: string | null;
        website?: string | null;
        phone?: string | null;
    }
}
