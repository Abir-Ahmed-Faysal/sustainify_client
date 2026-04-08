export type IdeaStatus = "APPROVED" | "DRAFT" | "REJECTED" | "UNDER_REVIEW";
export type UserRole = "ADMIN" | "MEMBER";

export interface IIdea {
    id: string;
    title: string;
    problemStatement: string;
    solution?: string; // Optional - partial data from server for paid ideas without access
    description: string;
    image: string;
    isPaid: boolean;
    price?: number;
    status: IdeaStatus;
    isFeatured: boolean;
    createdAt: string;
    updatedAt?: string;
    positiveRatio: number;
    totalUpVotes: number;
    totalDownVotes: number;
    unlock: boolean;
    comment: boolean;
    author: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        profile: {
            avatar: string;
        };
    };
    authorId: string;
    category: {
        id: string;
        name: string;
        image: string | null;
    };
    categoryId: string;
    _count: {
        comments: number;
        votes: number;
    };
    feedback?: string | null;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    attachments?: string[];
    userVote?: {
        id: string;
        type: "UP" | "DOWN";
    } | null;
    userFavourite?: boolean | null;
}

export interface IIdeaQuery {
    page?: number;
    limit?: number;
    searchTerm?: string;
    categoryName?: string;
    isPaid?: boolean;
    "totalUpVotes[gte]"?: number;
    "totalUpVotes[lte]"?: number;
    "price[gte]"?: number;
    "price[lte]"?: number;
    sortBy?: "createdAt" | "totalUpVotes" | "comments._count" | "price" | "positiveRatio,createdAt";
    sortOrder?: "asc" | "desc";
    authorId?: string;
}

// Create Idea payload — matches server createIdeaZodSchema exactly
// status is optional and only accepts "DRAFT" (server enforces this)
export interface IIdeaCreate {
    title: string;
    problemStatement: string;
    solution: string;
    description: string;
    categoryId: string;
    image?: string;
    price?: number;
    status?: "DRAFT";
    attachments?: string[];
}

// Update Idea payload — matches server updateIdeaZodSchema exactly.
// NOTE: status, feedback, isFeatured are NOT here — those are separate
// admin-only endpoints (updateIdeaStatus / updateIdeaStatusByAdmin / toggleIsFeatured).
export interface IIdeaUpdate {
    title?: string;
    problemStatement?: string;
    solution?: string;
    description?: string;
    categoryId?: string;
    image?: string;
    price?: number;
    attachments?: string[];
}

// Member-facing status change — matches server updateIdeaStatus schema.
// Only DRAFT ↔ UNDER_REVIEW transitions are allowed for members.
export type IIdeaMemberStatus = "DRAFT" | "UNDER_REVIEW";

// Admin status update payload — matches server updateIdeaStatusByAdmin schema.
export interface IIdeaAdminStatusUpdate {
    status: "APPROVED" | "REJECTED" | "UNDER_REVIEW";
    feedback?: string; // Required when status is REJECTED
}
