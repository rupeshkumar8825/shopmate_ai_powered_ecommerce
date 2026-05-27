import { selector } from "recoil";
import type { User } from "../../types/auth.types";
import { getLoggedInUserAtom } from "../atoms/authAtom";

// all selectors related to the user authentication comes here 


/**
 * selector to get the details of the logged in user 
 */
export const getLoggedInUserSelector = selector<User | null>({
    key : "getLoggedInUserSelector", 
    get : ({ get }) => {
        return get(getLoggedInUserAtom)
    }
});



/**
 * selector to check whether the user is logged in already or not
 */
export const isUserLoggedInSelector = selector<boolean>({
    key : "isUserLoggedInSelector", 
    get : ({ get }) => {
        // lets check whether the user is already present or not 
        if (get(getLoggedInUserAtom)){
            return true;
        }else {
            return false;
        }
    }
});

