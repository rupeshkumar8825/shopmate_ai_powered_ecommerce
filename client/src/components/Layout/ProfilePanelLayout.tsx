// layout to show the user profile panel showing the different details of the user 
// and also giving options to update the various details of the user like name, email, password and also the avatar/profile picture of the user.

import { useRecoilState } from "recoil";
import { isAuthPopupOpenAtom } from "../../recoil/atoms/popupAtom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import type { Avatar, UpdatePasswordPayload, UpdateProfilePayload } from "../../types/auth.types";

export const ProfilePanelLayout = () => {
    // all the component specific states comes here
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("")
    const [currentPassword , setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [avatar, setAvatar] = useState<Avatar | null>(null);





    // state related to recoil comes here
    const [isAuthPopUpOpen, setIsAuthPopupOpen] = useRecoilState(isAuthPopupOpenAtom);
    const { user,
            isAuthenticated,
            loginUser,
            registerUser,
            logoutUser,
            updatePassword,
            updateProfile,
            fetchUserDetails,
            forgotPassword,
            resetPassword } = useAuth();


    // all the state handlers comes here
    const loginHandler = () => {
        // given the username, password lets 
        // create the login payload and then try to call the login function from 
        // useAuth hook that we have created for this purpose
        if(!)
    }  
    
    const logoutHandler = async () => {
        // we just need to hit call the logout function already 
        // implemented in the useAuth hook for this purpose
        await logoutUser();
    }


    const handleUpdateProfile = async () => {
        // simply call the updateprofile function from the userAuth itself 
        // TODO : check how to pass the updated avatar file to update the profile
        // there seems to be some discrepancies in the types of avatar that we receive
        // from backend and how do we store it in the frontend. check it and then 
        // make the implementation common everywhere
        const payload : UpdateProfilePayload = {
            name : name, 
            email : email, 
            avatar : null
        }
        await updateProfile(payload);
    }


    const handleUpdatePassword = async () => {
        const payload : UpdatePasswordPayload = {
            confirmPassword : confirmPassword, 
            newPassword : newPassword, 
            currentPassword : currentPassword
        }
    }

    // all the hooks related to this component comes here
    useEffect(() => {
        // this means user has opened the profile panel layout
        // lets check whether the user is already logged in or not 
        // if logged in then we will set the relevant login information details
        // in the relevant state details for this purpose we will call the fetchUserDetails function from the useAuth hook which will call the relevant api to fetch the details of the user and also set the isAuthenticated to true if the user is authenticated and if there is any error then we will set the isAuthenticated to false and also set the user details to null
        if(user){
            // this means that the user is not null lets store the 
            // details into the relevant state variables of the component
            setName(user.name);
            setEmail(user.email);
            setAvatar(user.avatar);
        }
    }, [user])

    return (
        <div>
            <h1>Profile Panel Layout</h1>
        </div>
    )
}   



