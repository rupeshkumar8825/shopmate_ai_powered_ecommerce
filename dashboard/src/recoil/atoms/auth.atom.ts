// this is the authentication related atom 
// note that the dashboard app is built specifically for the admin as the dashboard 

import { atom } from "recoil";
import type { AuthStateAtom } from "../../types/auth.types";



export const authStateAtom = atom<AuthStateAtom>({
    key : "authStateAtom", 
    default : {
        loading : false,
        user : null,
        isAuthenticated : false,
        error : null
    }
});