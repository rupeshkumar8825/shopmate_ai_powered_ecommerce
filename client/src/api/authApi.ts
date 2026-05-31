// all the apis related to user authentication comes here

import type { ForgotPasswordPayload, ForgotPasswordResponse, LoginPayload, LoginResponse, LogoutPayload, LogoutResponse, RegisterPayload, RegisterResponse, ResetPasswordPayload, ResetPasswordResponse, UpdatePasswordPayload, UpdatePasswordResponse, UpdateProfilePayload, UpdateProfileResponse, UserDetailResponse } from "../types/auth.types"
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
    console.log("teh payload that we are sending for login is : \n", payload)
    const loginUserResponse = await axiosInstance.post("/v1/auth/login", payload);
    console.log("the login user response that we got from the server side is as follows\n", loginUserResponse)
    return loginUserResponse.data as LoginResponse
}




export const logoutUserApi = async (payload : LogoutPayload) : Promise<LogoutResponse> => {
    const logoutUserResponse = await axiosInstance.post("/v1/auth/logout", payload);
    console.log("The response from the backend side that we got is as follows \n", logoutUserResponse);
    return logoutUserResponse.data as LogoutResponse
} 



export const fetchUserDetailsApi = async () : Promise<UserDetailResponse> => {
    const userDetailsResponse = await axiosInstance.get("/v1/auth/me");
    console.log("inside the fetchuser details api actual api call", userDetailsResponse);
    // say everything went fine 
    return userDetailsResponse.data;
}


export const forgotPasswordApi = async (payload : ForgotPasswordPayload) : Promise<ForgotPasswordResponse> => {
    const forgotPasswordResponse = await axiosInstance.post(`/v1/auth/password/password/forgot?frontendUrl=${payload.frontEndUrl}`, {
        email : payload.email
    });

    // say everything went fine 
    return forgotPasswordResponse.data;
} 



export const resetPasswordApi = async (payload : ResetPasswordPayload) : Promise<ResetPasswordResponse> => {
    // note that the token that we are sending will not be the one which we usually send in the header for authentication 
    // but this token will be sent as a part of the url itself and this token will be used by the backend server to identify 
    // the user and then change the password for that user
    const resetPasswordResponse = await axiosInstance.put(`/v1/auth/password/reset/${payload.token}`, {
        password : payload.newPassword, 
        confirmPassword : payload.confirmPassword
    });

    // say everything went fine 
    return resetPasswordResponse.data;
}




export const updatePasswordApi = async (payload : UpdatePasswordPayload) : Promise<UpdatePasswordResponse> => {
    const updatePasswordResponse = await axiosInstance.put("/v1/auth/password/update", {
        password : payload.currentPassword, 
        newPassword : payload.newPassword, 
        confirmPassword : payload.confirmPassword
    });

    // say everything went fine 
    return updatePasswordResponse.data;
}



export const updateProfileApi = async (payload : UpdateProfilePayload) : Promise<UpdateProfileResponse> => {
    const formData = new FormData();
    if(payload.name) formData.append("name", payload.name);
    if(payload.email) formData.append("email", payload.email);
    if(payload.avatar) formData.append("avatar", payload.avatar);

    const updateProfileResponse = await axiosInstance.put("/v1/auth/profile/update", formData);

    // say everything went fine 
    return updateProfileResponse.data;
}

