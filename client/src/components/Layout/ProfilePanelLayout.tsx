// layout to show the user profile panel showing the different details of the user 
// and also giving options to update the various details of the user like name, email, password and also the avatar/profile picture of the user.

import { useRecoilState, useRecoilValue } from "recoil";
import { isAuthPopupOpenAtom } from "../../recoil/atoms/popupAtom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import type { Avatar, LoginPayload, UpdatePasswordPayload, UpdateProfilePayload } from "../../types/auth.types";
import { Upload } from "lucide-react";
import { isPasswordChangingAtom, isUpdatingProfileAtom } from "../../recoil/atoms/authAtom";

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
    const isPasswordChanging = useRecoilValue(isPasswordChangingAtom);
    const isUpdatingProfile = useRecoilValue(isUpdatingProfileAtom);
    const { user, isAuthenticated, logoutUser, updatePassword, updateProfile } = useAuth();


    
    // all the handlers relat       this component comes here 
    const logoutHandler = async () => {
        // we just need to hit call the logout function already 
        // implemented in the useAuth hook for this purpose
        console.log("Received the logout request from the user itself");
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
            avatar : updatedAvatar
        }
        console.log("the payload to be sent to the backend for updating the profile of the user is:\n", payload);
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
            setAvatar(user.avatar?.url || "");
            setConfirmPassword("");
            setNewPassword("");
            setCurrentPassword("");
        }
    }, [user])


    // this we will only open when the user is logged in 
    // or user is already authenticated for this purpose 
    if(!isAuthenticated){
        // say everything went fine 
        return null;
    }

    return (
        <div>
            {/* here comes the code to show the overlay across the screen */}
            <div onClick={() => setIsAuthPopupOpen(false)} className={`fixed top-0 right-0 w-full h-full bg-black/50 bg-opacity-50 z-40 ${isAuthPopUpOpen? "block" : "hidden"} `}></div>

            {/* actual navbar starts here  */}
            <div className={` bg-neutral-300 px-10 py-2 fixed top-0 right-0 w-[40%] h-full shadow-lg z-50 transform ${isAuthPopUpOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out bg-neutral-200 flex flex-col justify-start items-center gap-10`}>
                {/* heading of the profile section comes here */}
                <div className="">
                    <h1 className="text-3xl text-center font-bold">Profile Panel</h1>
                </div>

                {/* user info section comes here */}
                <div className="w-full flex flex-col justify-center items-center gap-10 px-10 py-6 rounded-lg bg-neutral-200">
                    {/* heading for the user info section comes here */}
                    <h2 className="text-xl text-center font-semibold w-full">User Information</h2>
                    <div className="flex justify-center items-center w-full">
                        {/* avatar of the user comes here */}
                        <img src={avatar || "/default.jpg"} alt={user?.name} className="w-20 h-20 rounded-full" />
                    </div>

                    {/* show the name of the user here */}
                    <p className="text-lg text-center p-2 bg-neutral-300 w-full  rounded-lg">{user?.name}</p>

                    {/* show the email of the user here */}
                    <p className="text-lg text-center p-2 bg-neutral-300 w-full rounded-lg ">{user?.email}</p>
                </div>



                {/* Profile update section comes here */}
                <div className=" bg-neutral-200 p-10 py-6  flex flex-col justify-center items-center gap-5 rounded-lg">
                    {/* heading for updating profile comes here */}
                    <h1 className="text-xl text-center font-semibold w-full">Update Profile</h1>

                    {/* section consisting all the informations that can be updated by the user */}
                    <div className="flex flex-col justify-center items-center gap-5">
                        {/* update user name input text comes here */}
                        <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Update Username" className="text-lg text-center p-2 bg-neutral-300 w-full  rounded-lg" value={name} />
                        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Update Email" className="text-lg text-center p-2 bg-neutral-300 w-full  rounded-lg" value={email} />

                        {/* give option to update the profile by option to upload an avatar file */}
                        <div className=" flex flex-row justify-center items-center">
                            <Upload></Upload>
                            <input type="file" onChange={(e) => setUpdatedAvatar(e.target.files ? e.target.files[0] : null)} className="p-1 w-[70%] " />
                        </div>

                        {/* button comes to be able to update the name, email and the profile picture too */}
                        <button onClick={handleUpdateProfile} className="px-4 py-2  rounded-md bg-component-background-500 text-white ">
                            {
                                isUpdatingProfile ? 
                                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                   : null

                            }
                            Save Changes
                        </button>

                        {/* UPDATE PASSWORD SECTION COMES HERE */}
                        <input type="text" onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" className="text-lg text-center p-2 bg-neutral-300 w-full  rounded-lg" value={currentPassword} />

                        {/* add new password input text comes here */}
                        <input type="text" onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter New Password" className="text-lg text-center p-2 bg-neutral-300 w-full  rounded-lg" value={newPassword} />
                        {/* add confirm new password input text comes here */}
                        <input type="text" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="text-lg text-center p-2 bg-neutral-300 w-full  rounded-lg" value={confirmPassword} />
                    </div>

                    {/* here comes the button to update the profile */}
                    <button onClick={handleUpdatePassword} className="bg-component-background-500 text-white px-4 py-2 rounded-md">
                        {
                            isPasswordChanging ? 
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
                            : null

                        }
                        Update Password
                    </button>
                </div>

                {/* button to logout from the website */}
                <div className="">
                    <button className="px-4 py-2 bg-component-background-500 text-white rounded-md" onClick={logoutHandler}>Logout</button>
                </div>

            </div>
        </div>
    )
}   



