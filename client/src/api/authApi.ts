// all the apis related to user authentication comes here

import type { RegisterPayload } from "../types/auth.types"
import axiosInstance from "./axiosInstance"



export const registerUser = async (payload : RegisterPayload) : Promise<boolean> => {
    // given the payload and the axiosinstance we need to 
    // make the post api call to register the user for this purpose 
    const registerUserResponse = await axiosInstance.post("/v1/auth/register", )

    // say everything went fine 
    return registerUserResponse
}