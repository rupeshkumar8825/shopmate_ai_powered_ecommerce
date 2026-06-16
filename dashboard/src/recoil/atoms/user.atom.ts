import { atom } from "recoil";
import type { User } from "../../types/auth.types";

export interface UserStateAtom {
    userOperationInProgress : boolean,
    users : User[],
    error : string | null
}


// this consists of the state to store the user related information
export const userStateAtom = atom<UserStateAtom>({
    key : "userStateAtom",
    default : {
        userOperationInProgress : false,
        users : [],
        error : null
    }
})