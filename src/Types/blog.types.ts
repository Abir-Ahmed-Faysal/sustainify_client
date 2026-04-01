import { IUser } from "./auth.types"; // Assuming IUser exists for consistency

export interface IBlog {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  authorId: string;
  author: IUser;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface IBlogCreate {
  title: string;
  content: string;
  image?: string;
  isPublished?: boolean;
}

export interface IBlogUpdate {
  title?: string;
  content?: string;
  image?: string;
  isPublished?: boolean;
}

export interface IBlogQuery {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  authorId?: string;
  isPublished?: boolean;
}
