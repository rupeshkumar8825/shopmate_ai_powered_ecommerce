// this is the authentication related atom 
// note that the dashboard app is built specifically for the admin as the dashboard 

import { atom } from "recoil";
import type { AuthStateAtom } from "../../types/auth.types";



export const authStateAtom = atom<AuthStateAtom>({
    key : "authStateAtom", 
    default : {
        loading : true, // note that this has been set to true initially just to make 
                        // sure that the spinner on the home page is shown correctly
        user : null,
        isAuthenticated : false,
        error : null
    }
});