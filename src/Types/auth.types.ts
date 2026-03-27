export interface ILoginResponse {
    accessToken : string;
    refreshToken : string;
    user : {
        email : string;
        name : string;
        role : string;
        image: string;
        status : string;
        isDeleted : boolean;
    }
}