// layout to show the user profile panel showing the different details of the user 
// and also giving options to update the various details of the user like name, email, password and also the avatar/profile picture of the user.

import { useRecoilState } from "recoil";
import { isAuthPopupOpenAtom } from "../../recoil/atoms/popupAtom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import type { Avatar, LoginPayload, UpdatePasswordPayload, UpdateProfilePayload } from "../../types/auth.types";

export const ProfilePanelLayout = () => {
    // all the component specific states comes here
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("")
    const [currentPassword , setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");
    const [updatedAvatar, setUpdatedAvatar] = useState<File | null>(null);





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
        const payload : LoginPayload = {
            email : email,
            password : currentPassword
        }

        // call the login user function from the useAuth hook for this purpose
        loginUser(payload);
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

        // lets make a call to the hook function to update the password 
        // of the user 
        await updatePassword(payload);
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
            setCurrentPassword(user.password);
            setAvatar(user.avatar?.public_id || "");
        }
    }, [user])

    return (
        <div>
            {/* here comes the code to show the overlay across the screen */}
            <div onClick={() => setIsAuthPopupOpen(false)} className={`fixed top-0 right-0 w-full h-full bg-black/50 bg-opacity-50 z-40 ${isAuthPopUpOpen? "block" : "hidden"} `}></div>

            {/* actual navbar starts here  */}
            <div className={`border-2 border-black fixed top-0 right-0 w-[40%] h-full shadow-lg z-50 transform ${isAuthPopUpOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out bg-neutral-200 flex flex-col justify-start items-center gap-20`}>
                {/* heading of the profile section comes here */}
                <div className="">
                    <h1 className="text-3xl text-center font-bold">Profile Panel</h1>
                </div>

                {/* user info section comes here */}
                <div>
                    {/* heading for the user info section comes here */}
                    <h2 className="text-xl text-center font-semibold">User Information</h2>
                    <div className="">
                        {/* avatar of the user comes here */}
                        <img src={avatar || "/default.jpg"} alt={user?.name} />
                    </div>

                    {/* show the name of the user here */}
                    <p className="text-lg text-center">{name}</p>

                    {/* show the email of the user here */}
                    <p className="text-lg text-center">{email}</p>
                </div>

                {/* Profile update section comes here */}
                <div className="border-2 border-red-500 flex flex-col justify-center items-center gap-5">
                    {/* heading for updating profile comes here */}
                    <h1 className="text-xl text-center">Update Profile</h1>

                    {/* section consisting all the informations that can be updated by the user */}
                    <div>

                        {/* give option to update the profile by option to upload an avatar file */}
                        <div className="border-2 border-red-500 flex flex-col justify-center items-center gap-2">
                            <p className="text-lg text-center">Upload New Avatar</p>
                            <input type="file" onChange={(e) => setUpdatedAvatar(e.target.files ? e.target.files[0] : null)} className="border border-neutral-500 p-2" />
                        </div>

                        {/* update user name input text comes here */}
                        <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Update Username" className="border border-neutral-500 p-2" value={name} />
                        {/* add new password input text comes here */}
                        <input type="text" onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter New Password" className="border border-neutral-500 p-2" value={newPassword} />
                        {/* add confirm new password input text comes here */}
                        <input type="text" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="border border-neutral-500 p-2" value={confirmPassword} />
                    </div>

                    {/* here comes the button to update the profile */}
                    <button onClick={handleUpdateProfile} className="bg-blue-500 text-white p-2 rounded-md">Update Profile</button>
                </div>

            </div>
        </div>
    )
}   



