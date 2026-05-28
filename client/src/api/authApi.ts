// all the apis related to user authentication comes here

import type { ForgotPasswordPayload, LoginPayload, LoginResponse, LogoutPayload, LogoutResponse, RegisterPayload, RegisterResponse, ResetPasswordPayload, UpdatePasswordPayload, UserDetailResponse } from "../types/auth.types"
import { getToken } from "../utils/tokenStorage";
import axiosInstance from "./axiosInstance"



export const registerUserApi  = async (payload : RegisterPayload) : Promise<RegisterResponse> => {
    // given the payload and the axiosinstance we need to 
    // make the post api call to register the user for this purpose 
    const registerUserResponse  = await axiosInstance.post("/v1/auth/register", payload);
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


export const forgotPasswordApi = async (payload : ForgotPasswordPayload) => {
    const token = getToken();
    const forgotPasswordResponse = await axiosInstance.post("/v1/auth/password/password/forgot", payload, {
        headers : {
            Authorization : `Bearer ${token}`
        }
    });

    // say everything went fine 
    return forgotPasswordResponse.data;
} 



export const resetPasswordApi = async (payload : ResetPasswordPayload) => {
    const resetPasswordResponse = await axiosInstance.put(`/v1/auth/password/reset/${payload.token}`, {
        password : payload.newPassword, 
        confirmPassword : payload.confirmPassword
    });

    // say everything went fine 
    return resetPasswordResponse.data;
}




export const updatePasswordApi = async (payload : UpdatePasswordPayload) => {
    const token = getToken();
    const updatePasswordResponse = await axiosInstance.put("/v1/auth/password/update", {
        password : payload.currentPassword, 
        newPassword : payload.newPassword, 
        confirmPassword : payload.confirmPassword
    }, {
        headers : {
            Authorization : `Bearer ${token}`
        }
    });

    // say everything went fine 
    return updatePasswordResponse.data;
}



export const updateProfileApi = async (payload : {name? : string, email? : string, avatar? : File}) => {
    const token = getToken();
    const formData = new FormData();
    if(payload.name) formData.append("name", payload.name);
    if(payload.email) formData.append("email", payload.email);
    if(payload.avatar) formData.append("files", payload.avatar);

    const updateProfileResponse = await axiosInstance.put("/v1/auth/profile/update", formData, {
        headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "multipart/form-data"
        }
    });

    // say everything went fine 
    return updateProfileResponse.data;
}

