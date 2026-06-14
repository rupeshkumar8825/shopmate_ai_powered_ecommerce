import { selector } from "recoil";
import { authStateAtom, type User } from "../atoms/auth.atom";

// this is the selectors related to the authentication itself for this purpose
export const isAuthOperationLoadingSelectors = selector<boolean>({
    key : "isAuthOperationLoadingSelectors", 
    get : ({ get }) => {
        return get(authStateAtom).loading
    }
})


export const isAuthenticatedSelector = selector<boolean>({
    key : "isAuthenticatedSelector",
    get : ({ get }) => {
        return get(authStateAtom).isAuthenticated
    }
});

export const authUserSelector = selector<User>({
    key : "authUserSelector", 
    get : ({ get }) => {
        return get(authStateAtom).user;
    }
})