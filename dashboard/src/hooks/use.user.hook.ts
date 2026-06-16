// useUser — the user hook for the ADMIN dashboard.
// It is the single place that ties together the api layer (admin.api.ts user endpoints)
// and the recoil state (userStateAtom). Components should consume this hook rather than
// calling the api functions or touching the atom directly.
//
// Reminder: this dashboard is admin-only. The user admin routes on the backend are
// guarded by the auth + "Admin" role middleware; here we surface any failure as a
// readable error message in the atom.

import { useSetRecoilState, useRecoilValue } from "recoil"
import { isAxiosError } from "axios"

import { userStateAtom } from "../recoil/atoms/user.atom"
import {
    usersSelector,
    userErrorSelector,
    isUserOperationInProgressSelector,
    usersCountSelector,
} from "../recoil/selectors/user.selectors"
import {
    getAllUsersAdminApi,
    deleteUserAdminApi,
} from "../api/admin.api"
import type {
    AdminGetAllUsersRequestPayload,
    AdminDeleteUserRequestPayload,
} from "../types/admin.types"


// turns whatever was thrown (axios error or the plain Errors thrown by the api layer)
// into a human readable message
const extractErrorMessage = (err: unknown): string => {
    if (isAxiosError(err)) {
        return err.response?.data?.message ?? err.message ?? "Something went wrong"
    }
    if (err instanceof Error) {
        switch (err.message) {
            case "EMPTY_RESPONSE":
            case "INVALID_RESPONSE":
                return "Received an unexpected response from the server. Please try again."
            default:
                return err.message
        }
    }
    return "Something went wrong"
}


export const useUser = () => {
    // ── read-only state pulled from the atom via selectors ──
    const users = useRecoilValue(usersSelector)
    const usersCount = useRecoilValue(usersCountSelector)
    const userOperationInProgress = useRecoilValue(isUserOperationInProgressSelector)
    const error = useRecoilValue(userErrorSelector)

    // single writer into the (object) user atom
    const setUserState = useSetRecoilState(userStateAtom)

    const clearError = () => {
        setUserState((prev) => ({ ...prev, error: null }))
    }


    // ── Fetch a page of users (GET /v1/admin/users?page=) ─────────────────────────
    const fetchAllUsers = async (payload: AdminGetAllUsersRequestPayload) => {
        setUserState((prev) => ({ ...prev, userOperationInProgress: true, error: null }))
        try {
            const response = await getAllUsersAdminApi(payload)
            setUserState((prev) => ({
                ...prev,
                users: response.userList,
                userOperationInProgress: false,
            }))
            return true
        } catch (err) {
            setUserState((prev) => ({
                ...prev,
                userOperationInProgress: false,
                error: extractErrorMessage(err),
            }))
            return false
        }
    }


    // ── Delete a single user (DELETE /v1/admin/user) ──────────────────────────────
    const deleteUser = async (payload: AdminDeleteUserRequestPayload) => {
        setUserState((prev) => ({ ...prev, userOperationInProgress: true, error: null }))
        try {
            await deleteUserAdminApi(payload)
            setUserState((prev) => ({
                ...prev,
                // drop the deleted user from the list
                users: prev.users.filter((user) => user.id !== payload.userId),
                userOperationInProgress: false,
            }))
            return true
        } catch (err) {
            setUserState((prev) => ({
                ...prev,
                userOperationInProgress: false,
                error: extractErrorMessage(err),
            }))
            return false
        }
    }


    return {
        // state
        users,
        usersCount,
        userOperationInProgress,
        error,

        // actions
        fetchAllUsers,
        deleteUser,
        clearError,
    }
}
