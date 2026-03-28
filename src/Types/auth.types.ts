import { UserRole } from "@/lib/authUtils";

export interface ILoginResponse {
    accessToken : string;
    refreshToken : string;
    user : {
        email : string;
        name : string;
        role : UserRole;
        image: string;
        status : string;
        isDeleted : boolean;
    }
}