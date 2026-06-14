// file consists of all the apis related to authentication
// please note that this we have already built for the normal users in the client project
// but this we again have to do for the admin dashboard users
//
// This layer abstracts the backend HTTP calls away from the rest of the frontend.
//
// IMPORTANT — this dashboard is meant ONLY for the admin:
//   The backend `/login` and `/me` endpoints do NOT restrict access by role (any valid
//   user gets a token). So this layer enforces the admin-only rule itself: after a
//   successful login / details fetch we assert that `user.role === "Admin"` and reject
//   otherwise. There is deliberately no `register` call here — admins are not created
//   through self-service signup on the dashboard.

import type {
    LoginPayload,
    LoginResponse,
    LogoutPayload,
    LogoutResponse,
    UserDetailResponse,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
    ResetPasswordPayload,
    ResetPasswordResponse,
    UpdatePasswordPayload,
    UpdatePasswordResponse,
    UpdateProfilePayload,
    UpdateProfileResponse,
    User,
} from "../types/auth.types"
import { axiosInstance } from "./axios.instance"


// guard used to keep non-admin users out of the dashboard
const assertIsAdmin = (user: User) => {
    if (user.role !== "Admin") {
        throw new Error("NOT_AN_ADMIN")
    }
}


export const loginAdminApi = async (payload: LoginPayload): Promise<LoginResponse> => {
    const loginResponse = await axiosInstance.post("/v1/auth/login", payload)

    if (!loginResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!loginResponse.data.user || !loginResponse.data.token) {
        throw new Error("INVALID_RESPONSE")
    }

    // dashboard is admin-only — reject any non-admin who managed to authenticate
    assertIsAdmin(loginResponse.data.user as User)

    return loginResponse.data as LoginResponse
}


export const logoutAdminApi = async (payload: LogoutPayload): Promise<LogoutResponse> => {
    const logoutResponse = await axiosInstance.post("/v1/auth/logout", payload)

    if (!logoutResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    return logoutResponse.data as LogoutResponse
}


// fetches the currently logged in admin's details (used to re-hydrate the session)
export const fetchAdminDetailsApi = async (): Promise<UserDetailResponse> => {
    const userDetailsResponse = await axiosInstance.get("/v1/auth/me")

    if (!userDetailsResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!userDetailsResponse.data.user) {
        throw new Error("INVALID_RESPONSE")
    }

    // a valid session belonging to a non-admin must not be treated as authenticated here
    assertIsAdmin(userDetailsResponse.data.user as User)

    return userDetailsResponse.data as UserDetailResponse
}


export const forgotPasswordApi = async (
    payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
    const forgotPasswordResponse = await axiosInstance.post(
        `/v1/auth/password/forgot?frontendUrl=${payload.frontEndUrl}`,
        { email: payload.email }
    )

    if (!forgotPasswordResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    return forgotPasswordResponse.data as ForgotPasswordResponse
}


export const resetPasswordApi = async (
    payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
    // the token here is the one received via the email link (sent in the url), NOT the
    // auth token that normally goes in the Authorization header / cookie
    const resetPasswordResponse = await axiosInstance.post(
        `/v1/auth/password/reset/${payload.token}`,
        {
            password: payload.newPassword,
            confirmPassword: payload.confirmPassword,
        }
    )

    if (!resetPasswordResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!resetPasswordResponse.data.user) {
        throw new Error("INVALID_RESPONSE")
    }

    return resetPasswordResponse.data as ResetPasswordResponse
}


export const updatePasswordApi = async (
    payload: UpdatePasswordPayload
): Promise<UpdatePasswordResponse> => {
    const updatePasswordResponse = await axiosInstance.put("/v1/auth/password/update", {
        password: payload.currentPassword,
        newPassword: payload.newPassword,
        confirmPassword: payload.confirmPassword,
    })

    if (!updatePasswordResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    return updatePasswordResponse.data as UpdatePasswordResponse
}


export const updateProfileApi = async (
    payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
    // profile update can include an avatar file, so it goes out as multipart/form-data
    const formData = new FormData()
    if (payload.name) formData.append("name", payload.name)
    if (payload.email) formData.append("email", payload.email)
    if (payload.avatar) formData.append("avatar", payload.avatar)

    const updateProfileResponse = await axiosInstance.put("/v1/auth/profile/update", formData, {
        headers: {
            // let the browser set the multipart boundary automatically
            "Content-Type": undefined,
        },
    })

    if (!updateProfileResponse.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!updateProfileResponse.data.user) {
        throw new Error("INVALID_RESPONSE")
    }

    // ensure the updated account is still an admin account
    assertIsAdmin(updateProfileResponse.data.user as User)

    return updateProfileResponse.data as UpdateProfileResponse
}
