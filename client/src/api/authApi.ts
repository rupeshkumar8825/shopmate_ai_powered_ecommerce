// all the apis related to user authentication comes here

import type { LoginPayload, LoginResponse, LogoutPayload, LogoutResponse, RegisterPayload, RegisterResponse, UserDetailResponse } from "../types/auth.types"
import { getToken } from "../utils/tokenStorage";
import axiosInstance from "./axiosInstance"



export const registerUserApi  = async (payload : RegisterPayload) : Promise<RegisterResponse> => {
    // given the payload and the axiosinstance we need to 
    // make the post api call to register the user for this purpose 
    const registerUserResponse  = await axiosInstance.post("/v1/auth/register", )
    const registerUserResponseData : RegisterResponse = registerUserResponse.data;
    // say everything went fine 
    return registerUserResponseData;
}




export const loginUserApi = async (payload : LoginPayload) : Promise<LoginResponse> => {
    const loginUserResponse = await axiosInstance.post("/v1/auth/login", payload);
    return loginUserResponse.data as LoginResponse
}




export const logoutUserApi = async (payload : LogoutPayload) : Promise<LogoutResponse> => {
    const logoutUserResponse = await axiosInstance.post("/v1/auth/logout", payload);
    return logoutUserResponse.data as LogoutResponse
} 



export const getUserDetailsApi = async () : Promise<UserDetailResponse> => {
    const token = getToken();
    const userDetailsResponse = await axiosInstance.get("/v1/auth/me", {
        headers : {
            Authorization : `Bearer ${token}`
        }
    });

    // say everything went fine 
    return userDetailsResponse.data;
}