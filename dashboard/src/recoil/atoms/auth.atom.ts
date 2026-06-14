// this is the authentication related atom 
// note that the dashboard app is built specifically for the admin as the dashboard 

import { atom } from "recoil";

// can only be accessed by the admin itself 
export interface AuthStateAtom {
    isAuthenticated : boolean
    loading  : boolean, 
    user : User
}


export interface Avatar {
    public_id : string,
    url : string
}

export interface User {
    name: string;
    id: string;
    email: string;
    password: string;
    role: "User" | "Admin";
    avatar: Avatar | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    createdAt: Date
}

export const authStateAtom = atom<AuthStateAtom>({
    key : "authStateAtom", 
    default : {
        loading : false, 
        user : null, 
        isAuthenticated : false
    }
});