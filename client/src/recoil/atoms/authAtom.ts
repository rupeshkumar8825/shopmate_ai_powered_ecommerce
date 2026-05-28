// file consisting all the atoms related to the authentication of the application 

import { atom } from "recoil";
import type { User } from "../../types/auth.types";

export const userAtom = atom<User | null>({
    key : "userAtom", 
    default : null
});


export const isAuthenticatedAtom = atom<boolean>({
    key : "isAuthenticatedAtom", 
    default : false
});


export const isUserLoggingInAtom = atom<boolean>({
    key: "isUserLoggingInAtom", 
    default : false
});

export const isUserRegisteringAtom = atom<boolean>({
    key : "isUserRegisteringAtom", 
    default : false
});


export const isUserLoggingOutAtom = atom<boolean>({
    key : "isUserLoggingOutAtom", 
    default : false
});



export const isPasswordChangingAtom = atom<boolean>({
    key : "isPasswordChangingAtom", 
    default : false
});



export const isUpdatingProfileAtom = atom<boolean>({
    key : "isUpdatingChangingAtom", 
    default : false
});


export const isFetchingUserAtom = atom<boolean>({
    key : "isFetchingUserAtom", 
    default : false
});


// state to store the error related to the authentication for this purpose
export const authErrorAtom = atom<string | null>({
    key : "authErrorAtom", 
    default : null
});


