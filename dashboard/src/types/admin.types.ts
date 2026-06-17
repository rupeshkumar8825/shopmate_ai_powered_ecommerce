// all the types related to the admin comes here 

import type { User } from "./auth.types"

export interface AdminGetAllUsersRequestPayload {
    pages : number
}

export interface AdminGetAllUsersResponse {
    success : boolean, 
    message : string, 
    currentPage : number, 
    totalUsers : number, 
    userList : User[]
}


export interface AdminDeleteUserRequestPayload {
    userId : string
}

export interface AdminDeleteUserResponse {
    success : boolean,
    message : string,
    deletedUser : User
}

// Note: the dashboard-stats types live in `dashboard.types.ts` (alongside the dashboard
// api / atom / selectors), even though the route is mounted under `/v1/admin`.