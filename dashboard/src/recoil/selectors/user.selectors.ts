import { selector } from "recoil";
import { userStateAtom } from "../atoms/user.atom";
import type { User } from "../../types/auth.types";

// this is the selectors related to the user state for this purpose


// true while any user operation (fetch / update / delete) is in flight
export const isUserOperationInProgressSelector = selector<boolean>({
    key : "isUserOperationInProgressSelector",
    get : ({ get }) => {
        return get(userStateAtom).userOperationInProgress
    }
})


// the full list of users currently held in the store
export const usersSelector = selector<User[]>({
    key : "usersSelector",
    get : ({ get }) => {
        return get(userStateAtom).users
    }
})


// the latest user related error message (null when there is none)
export const userErrorSelector = selector<string | null>({
    key : "userErrorSelector",
    get : ({ get }) => {
        return get(userStateAtom).error
    }
})


// derived : the total number of users in the store (handy for dashboard counts)
export const usersCountSelector = selector<number>({
    key : "usersCountSelector",
    get : ({ get }) => {
        return get(userStateAtom).users.length
    }
})
