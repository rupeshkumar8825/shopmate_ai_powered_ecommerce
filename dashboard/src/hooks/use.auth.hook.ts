// useAuth — the auth hook for the ADMIN dashboard.
// It is the single place that ties together the api layer (auth.api.ts) and the
// recoil state (authStateAtom). Components should consume this hook rather than calling
// the api functions or touching the atom directly.
//
// Reminder: this dashboard is admin-only. The api layer already rejects non-admins by
// throwing "NOT_AN_ADMIN"; here we surface that (and any other failure) as a readable
// error message in the atom.

import { useSetRecoilState, useRecoilValue } from "recoil"
import { isAxiosError } from "axios"

import { authStateAtom } from "../recoil/atoms/auth.atom"
import {
    authUserSelector,
    isAuthenticatedSelector,
    isAuthOperationLoadingSelectors,
    authErrorSelector,
} from "../recoil/selectors/auth.selectors"
import {
    loginAdminApi,
    logoutAdminApi,
    fetchAdminDetailsApi,
    forgotPasswordApi,
    resetPasswordApi,
    updatePasswordApi,
    updateProfileApi,
} from "../api/auth.api"
import type {
    LoginPayload,
    ForgotPasswordPayload,
    ResetPasswordPayload,
    UpdatePasswordPayload,
    UpdateProfilePayload,
} from "../types/auth.types"


// turns whatever was thrown (axios error or the plain Errors thrown by the api layer)
// into a human readable message
const extractErrorMessage = (err: unknown): string => {
    if (isAxiosError(err)) {
        return err.response?.data?.message ?? err.message ?? "Something went wrong"
    }
    if (err instanceof Error) {
        switch (err.message) {
            case "NOT_AN_ADMIN":
                return "This account is not authorized to access the admin dashboard."
            case "EMPTY_RESPONSE":
            case "INVALID_RESPONSE":
                return "Received an unexpected response from the server. Please try again."
            default:
                return err.message
        }
    }
    return "Something went wrong"
}

// the backend signals an expired / missing session with a 401
const isSessionExpired = (err: unknown): boolean =>
    isAxiosError(err) && err.response?.status === 401


export const useAuth = () => {
    // ── read-only state pulled from the atom via selectors ──
    const user = useRecoilValue(authUserSelector)
    const isAuthenticated = useRecoilValue(isAuthenticatedSelector)
    const loading = useRecoilValue(isAuthOperationLoadingSelectors)
    const error = useRecoilValue(authErrorSelector)

    // single writer into the (object) auth atom
    const setAuthState = useSetRecoilState(authStateAtom)

    const clearError = () => {
        setAuthState((prev) => ({ ...prev, error: null }))
    }


    // ── Login (admin only) ──────────────────────────────────────────────────────
    const loginAdmin = async (payload: LoginPayload) => {
        setAuthState((prev) => ({ ...prev, loading: true, error: null }))
        try {
            const response = await loginAdminApi(payload)
            setAuthState((prev) => ({
                ...prev,
                user: response.user,
                isAuthenticated: true,
                loading: false,
            }))
            return true
        } catch (err) {
            setAuthState((prev) => ({
                ...prev,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: extractErrorMessage(err),
            }))
            return false
        }
    }


    // ── Logout ──────────────────────────────────────────────────────────────────
    const logoutAdmin = async () => {
        setAuthState((prev) => ({ ...prev, loading: true, error: null }))
        try {
            await logoutAdminApi({})
        } catch (err) {
            // even if the request fails we still log the admin out locally
            console.error("[logoutAdmin]", extractErrorMessage(err))
        } finally {
            setAuthState((prev) => ({
                ...prev,
                user: null,
                isAuthenticated: false,
                loading: false,
            }))
        }
    }


    // ── Re-hydrate the session (e.g. on app load / refresh) ──────────────────────
    const fetchAdminDetails = async () => {
        setAuthState((prev) => ({ ...prev, loading: true, error: null }))
        try {
            const response = await fetchAdminDetailsApi()
            setAuthState((prev) => ({
                ...prev,
                user: response.user,
                isAuthenticated: true,
                loading: false,
            }))
            return true
        } catch (err) {
            // an expired session or a non-admin account just means "not logged in" —
            // don't surface that as a loud error on a silent boot-time check
            const silent = isSessionExpired(err)
            setAuthState((prev) => ({
                ...prev,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: silent ? null : extractErrorMessage(err),
            }))
            return false
        }
    }


    // ── Forgot password (sends reset email) ──────────────────────────────────────
    const forgotPassword = async (payload: ForgotPasswordPayload) => {
        setAuthState((prev) => ({ ...prev, loading: true, error: null }))
        try {
            await forgotPasswordApi(payload)
            setAuthState((prev) => ({ ...prev, loading: false }))
            return true
        } catch (err) {
            setAuthState((prev) => ({ ...prev, loading: false, error: extractErrorMessage(err) }))
            return false
        }
    }


    // ── Reset password (via emailed token) ───────────────────────────────────────
    const resetPassword = async (payload: ResetPasswordPayload) => {
        setAuthState((prev) => ({ ...prev, loading: true, error: null }))
        try {
            await resetPasswordApi(payload)
            // for security, force a fresh login afterwards
            await logoutAdminApi({}).catch(() => undefined)
            setAuthState((prev) => ({
                ...prev,
                user: null,
                isAuthenticated: false,
                loading: false,
            }))
            return true
        } catch (err) {
            setAuthState((prev) => ({ ...prev, loading: false, error: extractErrorMessage(err) }))
            return false
        }
    }


    // ── Update password (while logged in) ────────────────────────────────────────
    const updatePassword = async (payload: UpdatePasswordPayload) => {
        setAuthState((prev) => ({ ...prev, loading: true, error: null }))
        try {
            await updatePasswordApi(payload)
            // for security, force a fresh login after a password change
            await logoutAdminApi({}).catch(() => undefined)
            setAuthState((prev) => ({
                ...prev,
                user: null,
                isAuthenticated: false,
                loading: false,
            }))
            return true
        } catch (err) {
            setAuthState((prev) => ({ ...prev, loading: false, error: extractErrorMessage(err) }))
            return false
        }
    }


    // ── Update profile (name / email / avatar) ───────────────────────────────────
    const updateProfile = async (payload: UpdateProfilePayload) => {
        setAuthState((prev) => ({ ...prev, loading: true, error: null }))
        try {
            const response = await updateProfileApi(payload)
            setAuthState((prev) => ({ ...prev, user: response.user, loading: false }))
            return true
        } catch (err) {
            if (isSessionExpired(err)) {
                setAuthState((prev) => ({
                    ...prev,
                    user: null,
                    isAuthenticated: false,
                    loading: false,
                    error: extractErrorMessage(err),
                }))
                return false
            }
            setAuthState((prev) => ({ ...prev, loading: false, error: extractErrorMessage(err) }))
            return false
        }
    }


    return {
        // state
        user,
        isAuthenticated,
        loading,
        error,

        // actions
        loginAdmin,
        logoutAdmin,
        fetchAdminDetails,
        forgotPassword,
        resetPassword,
        updatePassword,
        updateProfile,
        clearError,
    }
}
