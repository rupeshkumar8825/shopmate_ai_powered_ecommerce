// all the types related to the authentication of the user comes here

// defining teh register payload to be sent to the backend server 
export  interface RegisterPayload  {
    name : string, 
    email : string, 
    password : string
}


//TODO : Check how to define the roles as an enum in the ts and 
// then try to use this enum type for the role field in case of 
// user type for this purpose
// enum Role {
//     User = 0, 
//     Admin = 1
// }

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


export interface RegisterResponse {
    success : string, 
    user : User,
    message : string, 
}


//  interface for defining the payload to be sent to the backend server 
// for logging into the application
export  interface LoginPayload  {
    email : string, 
    password : string
}

export interface LoginResponse {
    success : boolean, 
    message : string, 
    token : string, 
    user : User 
}

//  interface for defining the payload to be sent to the backend server
// for logging out of the application 
export  interface LogoutPayload  {

}



export interface LogoutResponse {
    success : string, 
    message : string
}



export interface APIFailPayload {
    success : string, 
    message : string
}



export interface UserDetailPayload {

}



export interface UserDetailResponse {
    success : boolean, 
    message : string, 
    user : User
}


export interface ForgotPasswordPayload {
    email : string, 
    frontEndUrl : string
}

export interface ForgotPasswordResponse {
    success : boolean, 
    message : string
}


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



export interface UpdatePasswordPayload {
    confirmPassword : string,
    currentPassword : string, 
    newPassword : string
}

export interface UpdatePasswordResponse {
    success : boolean, 
    message : string
}

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

