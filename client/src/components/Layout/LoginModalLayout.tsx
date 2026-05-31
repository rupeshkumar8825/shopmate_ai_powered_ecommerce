// this is the loginmodal component from users can login

import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { isAuthPopupOpenAtom } from "../../recoil/atoms/popupAtom";
import { useRecoilState } from "recoil";
import { authErrorAtom, isFetchingUserAtom, isPasswordChangingAtom, isUpdatingProfileAtom, isUserLoggingInAtom, isUserLoggingOutAtom, isUserRegisteringAtom } from "../../recoil/atoms/authAtom";
import { useEffect, useState } from "react";
import { AuthActionType, type ForgotPasswordPayload, type LoginPayload, type RegisterPayload, type ResetPasswordPayload } from "../../types/auth.types";
import { User } from "lucide-react";


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

    const { user, isAuthenticated, loginUser, registerUser, forgotPassword, resetPassword } = useAuth();


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
    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("inside the submit button ")
        // based on the loginModalLayoutMode we will decide which action to perform
        switch(loginModalLayoutMode) {
            case AuthActionType.SIGNIN : {
                // call the login function from the useAuth hook for this purpose
                const payload : LoginPayload = {
                    email: formData.email,
                    password: formData.password
                }
                console.log("Inside the form submit. Going to hit the login api. ")
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
                // lets change the state from forgot_password to sign in now 
                setLoginModalLayoutMode(AuthActionType.SIGNIN);
                //toggle the auth popup 
                setIsAuthPopupOpen(!isAuthPopUpOpen);
                break;
            }

            case AuthActionType.RESET_PASSWORD : {
                // call the reset password function from the useAuth hook for this purpose
                const payload : ResetPasswordPayload = {
                    token : location.pathname.split("/").pop() || "",
                    newPassword : formData.password,
                    confirmPassword : formData.confirmPassword
                }
                resetPassword(payload);
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

    // if the user is already logged in then we will now show this login page 
    if(isAuthenticated || user) {
        return null;
    }

    let isLoading = isUserLoggingIn || isUserRegistering || isPasswordChanging;



    return(
        <div>
            {/* overlay of the login payload comes here  */}
            <div onClick={() => setIsAuthPopupOpen(false)} className={`fixed top-0 right-0 w-full h-full bg-black/50 bg-opacity-50 z-40  ${isAuthPopUpOpen ? "block" : "hidden"}`}></div>
            
            <div className={`border-2 border-white fixed top-0 right-0 w-[40%] h-full bg-neutral-300 shadow-lg z-50 transform ${isAuthPopUpOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out  flex flex-col justify-center items-center gap-10`}>
                <div className=" flex flex-col justify-center items-center gap-10  bg-neutral-200 p-10 rounded-lg">

                    {/* heading of the login modal comes here */}
                    <h1 className="text-3xl text-center cursor-pointer">
                        {
                            loginModalLayoutMode === AuthActionType.RESET_PASSWORD ? "Reset Password"
                            : loginModalLayoutMode === AuthActionType.SIGNUP ?  "Create Account"
                            : loginModalLayoutMode === AuthActionType.FORGOT_PASSWORD ? "Forgot Password" : "Welcome Back" 
                        }
                    </h1>

                    {/* Authentication related form comes here */}
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        {/* full name - need to show this only for sign up */}
                        {
                            loginModalLayoutMode === AuthActionType.SIGNUP ? 
                            <div className="flex flex-row justify-center items-center  border border-neutral-500 p-2 rounded-md">
                                <User></User>
                                <input type="text" placeholder="Enter Full Name" className="p-2" value={formData.name} onChange={(e) => setFormData({...formData, name : e.target.value })}/>
                            </div> : null
                        }

                        {/* EMAIL always visible except reset mode */}
                        {
                            loginModalLayoutMode !== AuthActionType.RESET_PASSWORD ? 
                            <div className="flex flex-row justify-center items-center  border border-neutral-500 p-2 rounded-md">
                                <User></User>
                                <input type="email" placeholder="Email" className="p-2" value={formData.email} onChange={(e) => setFormData({...formData, email : e.target.value})} />
                            </div> : null
                        } 


                        {/* PASSWORD - Always visible except the forgot mode */}
                        {
                            loginModalLayoutMode !== AuthActionType.FORGOT_PASSWORD ? 
                            <div className="flex flex-row justify-center items-center border border-neutral-500 p-2 rounded-md">
                                <User></User>
                                <input type="password" placeholder="Password" className="p-2" value={formData.password} onChange={(e) => setFormData({...formData, password : e.target.value})} />
                            </div> : null
                        }

                        {/* CONFIRM PASSWORD - Only visible at the time of reset password */}
                        {
                            loginModalLayoutMode === AuthActionType.RESET_PASSWORD ? 
                            <div className="flex flex-row justify-center items-center border border-neutral-500 p-2 rounded-md">
                                <User></User>
                                <input type="password" placeholder="Confirm Password" className="p-2" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword : e.target.value})} />
                            </div> : null
                        }
                        

                        {/* FORGOT PASSWORD : this forgot password button or link comes onlly in case of the signin itself */}
                        {
                            loginModalLayoutMode === AuthActionType.SIGNIN ? 
                            <p className="text-right text-blue-500 text-sm cursor-pointer" onClick={() => setLoginModalLayoutMode(AuthActionType.FORGOT_PASSWORD)}>
                                Forgot Password
                            </p> : null 
                            
                        }


                        {/* SUBMIT comes here. Please note that this button will disabled while isLoading flag is true  */}
                        <button type="submit" disabled={isLoading} className={`bg-neutral-300  p-2 rounded-md font-semibold ${isLoading? "opacity-70 cursor-not-allowed" : "hover:glow-on-hover"}`}>
                            {/* now based on the mode we need to show multiple text in the button for this purpose */}
                            {
                                isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>
                                            { loginModalLayoutMode === AuthActionType.RESET_PASSWORD ? "Reseting Password..." : 
                                                loginModalLayoutMode === AuthActionType.SIGNUP ? "Signing up..." : 
                                                loginModalLayoutMode === AuthActionType.SIGNIN ? "Signing in..." : 
                                                loginModalLayoutMode === AuthActionType.FORGOT_PASSWORD ? "Requesting for email..." : "Signing in..."}
                                        </span>
                                    </>
                                ) : 
                                loginModalLayoutMode === AuthActionType.RESET_PASSWORD ? "Reset Password" : 
                                loginModalLayoutMode === AuthActionType.SIGNUP ? "Create Account" : 
                                loginModalLayoutMode === AuthActionType.SIGNIN ? "Sign In" : 
                                loginModalLayoutMode === AuthActionType.FORGOT_PASSWORD ? "Send Reset Email" : "Sign In"
                                
                            }
                        </button>

                        {/* When the user is on the SignIn then we need to show the option to go to the SignUp page 
                        and if the user is on the SignUp page then we need to show the option to go to the SignIn page */}
                        {
                            (loginModalLayoutMode === AuthActionType.SIGNIN || loginModalLayoutMode === AuthActionType.SIGNUP) ? 
                            <div className="border-2 border-black flex justify-center items-center">
                                <button type="button" onClick={() => loginModalLayoutMode === AuthActionType.SIGNIN ? setLoginModalLayoutMode(AuthActionType.SIGNUP) : setLoginModalLayoutMode(AuthActionType.SIGNIN)}>
                                    {
                                        loginModalLayoutMode === AuthActionType.SIGNIN ? <p>
                                            Don't have an account? <span className="text-blue-500 cursor-pointer">Sign In</span>
                                        </p>  : <p>
                                            Already have an account? <span className="text-blue-500 cursor-pointer">Sign Up</span>
                                        </p>
                                    }
                                </button>
                            </div> : null
                        }
                    </form>
                    
                    
                </div>
            </div>
        </div>
    )
}


