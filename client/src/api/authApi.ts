// all the apis related to user authentication comes here

import type { ForgotPasswordPayload, ForgotPasswordResponse, LoginPayload, LoginResponse, LogoutPayload, LogoutResponse, RegisterPayload, RegisterResponse, ResetPasswordPayload, ResetPasswordResponse, UpdatePasswordPayload, UpdatePasswordResponse, UpdateProfilePayload, UpdateProfileResponse, UserDetailResponse } from "../types/auth.types"
import axiosInstance from "./axiosInstance"



export const registerUserApi  = async (payload : RegisterPayload) : Promise<RegisterResponse> => {
    // given the payload and the axiosinstance we need to 
    // make the post api call to register the user for this purpose 
    const registerUserResponse  = await axiosInstance.post("/v1/auth/register", payload);
    // check whether or not we indeed got an response from the backend server or not
    if(!registerUserResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }
    // check if there is user details in the backend response or not
    if(!registerUserResponse.data.user) {
        throw new Error("INVALID_RESPONSE")
    }
    
    // say everything went fine 
    return registerUserResponse.data as RegisterResponse;
}




export const loginUserApi = async (payload : LoginPayload) : Promise<LoginResponse> => {
    const loginUserResponse = await axiosInstance.post("/v1/auth/login", payload);

    if(!loginUserResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if(!loginUserResponse.data.user || !loginUserResponse.data.token) {
        throw new Error("INVALID_RESPONSE")
    }

    return loginUserResponse.data as LoginResponse
}




export const logoutUserApi = async (payload : LogoutPayload) : Promise<LogoutResponse> => {
    const logoutUserResponse = await axiosInstance.post("/v1/auth/logout", payload);

    if(!logoutUserResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    return logoutUserResponse.data as LogoutResponse
} 



export const fetchUserDetailsApi = async () : Promise<UserDetailResponse> => {
    const userDetailsResponse = await axiosInstance.get("/v1/auth/me");

    if(!userDetailsResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if(!userDetailsResponse.data.user) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine 
    return userDetailsResponse.data as UserDetailResponse;
}




export const forgotPasswordApi = async (payload : ForgotPasswordPayload) : Promise<ForgotPasswordResponse> => {
    const forgotPasswordResponse = await axiosInstance.post(`/v1/auth/password/password/forgot?frontendUrl=${payload.frontEndUrl}`, {
        email : payload.email
    });

    if(!forgotPasswordResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    // say everything went fine 
    return forgotPasswordResponse.data as ForgotPasswordResponse;
} 



export const resetPasswordApi = async (payload : ResetPasswordPayload) : Promise<ResetPasswordResponse> => {
    // note that the token that we are sending will not be the one which we usually send in the header for authentication 
    // but this token will be sent as a part of the url itself and this token will be used by the backend server to identify 
    // the user and then change the password for that user
    const resetPasswordResponse = await axiosInstance.put(`/v1/auth/password/reset/${payload.token}`, {
        password : payload.newPassword, 
        confirmPassword : payload.confirmPassword
    });

    if(!resetPasswordResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if(!resetPasswordResponse.data.user) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine 
    return resetPasswordResponse.data as ResetPasswordResponse;
}




export const updatePasswordApi = async (payload : UpdatePasswordPayload) : Promise<UpdatePasswordResponse> => {
    const updatePasswordResponse = await axiosInstance.put("/v1/auth/password/update", {
        password : payload.currentPassword, 
        newPassword : payload.newPassword, 
        confirmPassword : payload.confirmPassword
    });

    if(!updatePasswordResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    // say everything went fine 
    return updatePasswordResponse.data as UpdatePasswordResponse;
}





export const updateProfileApi = async (payload : UpdateProfilePayload) : Promise<UpdateProfileResponse> => {
    const formData = new FormData();
    if(payload.name) formData.append("name", payload.name);
    if(payload.email) formData.append("email", payload.email);
    if(payload.avatar) formData.append("avatar", payload.avatar);

    const updateProfileResponse = await axiosInstance.put("/v1/auth/profile/update", formData);

    // lets check the received a valid response or not for this purpose 
    if(!updateProfileResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if(!updateProfileResponse.data.user) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine 
    return updateProfileResponse.data as UpdateProfileResponse;
}

