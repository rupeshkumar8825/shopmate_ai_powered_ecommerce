// this consists of all the types related to the authentication related functionality 
// can only be accessed by the admin itself 
export interface AuthStateAtom {
    isAuthenticated : boolean
    loading  : boolean,
    user : User | null,
    // last auth error message (e.g. failed login / not-an-admin), null when there is none
    error : string | null
}


export interface Avatar {
    public_id : string,
    url : string
}

export interface User {
    name: string;
    id: string;
    email: string;
    password: string;
    role: "User" | "Admin";
    avatar: Avatar | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    createdAt: Date
}


// ─────────────────────────────────────────────────────────────────────────────
// Auth API payloads & responses
// NOTE: This dashboard is meant ONLY for the admin. The backend `/login` and `/me`
// endpoints do not enforce a role, so the API layer (auth.api.ts) is responsible for
// rejecting non-admin users. There is intentionally NO register payload/response here
// since admins are not self-registered through the dashboard.
// ─────────────────────────────────────────────────────────────────────────────


// generic shape returned by the backend when an operation fails
export interface APIFailResponse {
    success : string | boolean,
    message : string
}


// ── Login ──
export interface LoginPayload {
    email : string,
    password : string
}

export interface LoginResponse {
    success : boolean,
    message : string,
    token : string,
    user : User
}


// ── Logout ──
// the logout endpoint does not need any payload; the cookie identifies the session
export interface LogoutPayload {
}

export interface LogoutResponse {
    success : string,
    message : string
}


// ── Current admin details (GET /me) ──
export interface UserDetailResponse {
    success : boolean,
    message : string,
    user : User
}


// ── Forgot password ──
export interface ForgotPasswordPayload {
    email : string,
    frontEndUrl : string
}

export interface ForgotPasswordResponse {
    success : boolean,
    message : string
}


// ── Reset password (token comes from the email link, sent in the url) ──
export interface ResetPasswordPayload {
    token : string,
    newPassword : string,
    confirmPassword : string
}

export interface ResetPasswordResponse {
    success : boolean,
    message : string,
    user : User
}


// ── Update password (while logged in) ──
export interface UpdatePasswordPayload {
    currentPassword : string,
    newPassword : string,
    confirmPassword : string
}

export interface UpdatePasswordResponse {
    success : boolean,
    message : string
}


// ── Update profile ──
export interface UpdateProfilePayload {
    name : string,
    email : string,
    avatar : File | null
}

export interface UpdateProfileResponse {
    success : boolean,
    message : string,
    user : User
}