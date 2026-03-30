export type IdeaStatus = "APPROVED" | "DRAFT" | "REJECTED" | "UNDER_REVIEW";
export type UserRole = "ADMIN" | "MEMBER";

export interface IIdea {
    id: string;
    title: string;
    problemStatement: string;
    solution: string;
    description: string;
    image: string;
    isPaid: boolean;
    price?: number;
    status: IdeaStatus;
    isFeatured: boolean;
    createdAt: string;
    positiveRatio: number;
    totalUpVotes: number;
    totalDownVotes: number;
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
