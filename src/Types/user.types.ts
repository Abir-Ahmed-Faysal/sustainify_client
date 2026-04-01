export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: {
    id: string;
    userId: string;
    avatar?: string;
    bio?: string;
    address?: string;
  };
}

export interface IUserListResponse {
  data: IUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
}

export interface UserInfo {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MEMBER";
}
