// file consisting all the atoms related to the authentication of the application 

import { atom } from "recoil";
import type { User } from "../../types/auth.types";

export const getLoggedInUserAtom = atom<User | null>({
    key : "getLoggedInUserAtom", 
    default : null
});


export const isUserLoggedIn = atom<boolean>({
    key : "isUserLoggedIn", 
    default : false
});


