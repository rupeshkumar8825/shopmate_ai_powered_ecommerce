// this consists of all the types related to the authentication related functionality 
// can only be accessed by the admin itself 
export interface AuthStateAtom {
    isAuthenticated : boolean
    loading  : boolean, 
    user : User | null
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