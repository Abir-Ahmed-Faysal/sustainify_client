import { UserRole } from "./idea.types";

export interface IUser {
    id : string;
    email : string;
    name : string;
    role : UserRole;
    image: string;
    status : string;
    isDeleted : boolean;
    profile?: {
        avatar: string | null;
        bio: string | null;
    }
}

export interface ILoginResponse {
    accessToken : string;
    refreshToken : string;
    user : IUser
}