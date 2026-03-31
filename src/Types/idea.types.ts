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
    author: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        profile: {
            avatar: string;
        };
    };
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
    category?: string;
    isPaid?: boolean;
    minVotes?: number;
    sortBy?: "createdAt" | "voteCount" | "commentCount";
    sortOrder?: "asc" | "desc";
    authorId?: string;
}

// Create Idea payload matching backend Zod schema
export interface IIdeaCreate {
    title: string;
    problemStatement: string;
    solution: string;
    description: string;
    categoryId: string;
    image?: string;
    price?: number;
    status?: "DRAFT";
}

// Update Idea payload matching backend Zod schema
export interface IIdeaUpdate {
    title?: string;
    problemStatement?: string;
    solution?: string;
    description?: string;
    categoryId?: string;
    image?: string;
    price?: number;
    status?: "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
    feedback?: string;
    isFeatured?: boolean;
}
