// this is the loginmodal component from users can login

import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { isAuthPopupOpenAtom } from "../../recoil/atoms/popupAtom";
import { useRecoilState } from "recoil";
import { authErrorAtom, isFetchingUserAtom, isPasswordChangingAtom, isUpdatingProfileAtom, isUserLoggingInAtom, isUserLoggingOutAtom, isUserRegisteringAtom } from "../../recoil/atoms/authAtom";
import { useEffect, useState } from "react";
import { AuthActionType, type ForgotPasswordPayload, type LoginPayload, type RegisterPayload } from "../../types/auth.types";


export interface LoginFormData {
    name : string,
    email : string,
    password : string, 
    confirmPassword : string
}

export const LoginModalLayout = () => {
    const location = useLocation();
    

    // all the component states comes here 
    const [loginModalLayoutMode, setLoginModalLayoutMode] = useState<AuthActionType>(AuthActionType.SIGNIN);
    const [formData, setFormData] = useState<LoginFormData>({
        name : "",
        email : "",
        password : "",
        confirmPassword : ""
    });

    const { user, isAuthenticated, loginUser, registerUser, forgotPassword } = useAuth();


    // all the recoil states related to this component comes here
    const [isAuthPopUpOpen, setIsAuthPopupOpen] = useRecoilState(isAuthPopupOpenAtom);
    const [isUserLoggingIn, setIsUserLoggingIn] = useRecoilState(isUserLoggingInAtom);
    const [isUserRegistering, setIsUserRegistering] = useRecoilState(isUserRegisteringAtom);
    const [isUserLoggingOut, setIsUserLoggingOut] = useRecoilState(isUserLoggingOutAtom);
    const [isPasswordChanging, setIsPasswordChanging] = useRecoilState(isPasswordChangingAtom);
    const [isUpdatingProfile, setIsUpdatingProfile] = useRecoilState(isUpdatingProfileAtom);
    const [isFetchingUser, setIsFetchingUser] = useRecoilState(isFetchingUserAtom);
    const [authError, setAuthError] = useRecoilState(authErrorAtom);


    // all the handlers of the component comes here
    const handleSubmit = () => {
        // based on the loginModalLayoutMode we will decide which action to perform
        switch(loginModalLayoutMode) {
            case AuthActionType.SIGNIN : {
                // call the login function from the useAuth hook for this purpose
                const payload : LoginPayload = {
                    email: formData.email,
                    password: formData.password
                }
                loginUser(payload);
                break;
            }

            case AuthActionType.SIGNUP : {
                // call the register function from the useAuth hook for this purpose
                const payload : RegisterPayload = {
                    name : formData.name,
                    email : formData.email,
                    password : formData.password
                }
                registerUser(payload);
                break;
            }

            case AuthActionType.FORGOT_PASSWORD : {
                // call the forgot password function from the useAuth hook for this purpose
                const payload : ForgotPasswordPayload = {
                    email : formData.email,
                    frontEndUrl : `${window.location.origin}/password/reset`
                }
                forgotPassword(payload);
                break;
            }

            case AuthActionType.RESET_PASSWORD : {
                // call the reset password function from the useAuth hook for this purpose
                break;
            }
        }
    }


    // all the hooks related to this component comes here
    useEffect(() => {
        // if the user is authenticated then we will close the login modal 
        if(isAuthenticated) {
            setIsAuthPopupOpen(false);
            // also we will reset the form data
            setFormData({
                name : "",
                email : "",
                password : "",
                confirmPassword : ""
            });
        }
    }, [isAuthenticated])

    // lets create the default useeffect which runs only for the first time
    // when this component renders for the first time 
    useEffect(() => {
        // lets try to find out whether this is a reset password URL or not 
        if(location.pathname.includes("/password/reset")) {
            setLoginModalLayoutMode(AuthActionType.RESET_PASSWORD);
        }else {
            setLoginModalLayoutMode(AuthActionType.SIGNIN);
        }   
    }, [location.pathname])

    // all other logics related to this component comes here 

    return(
        <div className="border-2 border-black fixed top-0 right-0 w-[40%] h-full shadow-lg z-50 transform translate-x-0 transition-transform duration-300 ease-in-out bg-neutral-200 flex flex-col justify-center items-center gap-5">
            {/* heading of the login modal comes here */}
            <h1 className="text-3xl text-center">Login to your account</h1>

            {/* form for login comes here */}
            <form className="flex flex-col gap-5">
                <input type="email" placeholder="Email" className="border border-neutral-500 p-2" />
                <input type="password" placeholder="Password" className="border border-neutral-500 p-2" />

                {/* button to submit the form comes here */}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Login</button>
            </form>

            {/* option to redirect to the registration page comes here */}
            <p className="text-center">Don't have an account? <a href="/register" className="text-blue-500">Register here</a></p>
        </div>
    )
}


