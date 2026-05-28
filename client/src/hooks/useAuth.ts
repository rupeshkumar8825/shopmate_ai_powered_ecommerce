// this is the auth related hooks which is responsible for handling all the authentication related logic
// the advantage of using hooks is that we will be able to use this at many place 
// its like the function where we write code once and then can use this at multiple places

import type { LoginPayload } from "../types/auth.types"

export const useAuth = () => {

    const loginUser = async (payload : LoginPayload) => {
        
    }
}