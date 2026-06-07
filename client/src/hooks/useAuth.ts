// this is the auth related hooks which is responsible for handling all the authentication related logic
// the advantage of using hooks is that we will be able to use this at many place 
// its like the function where we write code once and then can use this at multiple places

import { useRecoilState, useSetRecoilState } from "recoil"
import type { ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload, UpdatePasswordPayload, UpdateProfilePayload } from "../types/auth.types"
import { authErrorAtom, isAuthenticatedAtom, isFetchingUserAtom, isPasswordChangingAtom, isUpdatingProfileAtom, isUserLoggingInAtom, isUserLoggingOutAtom, isUserRegisteringAtom, userAtom } from "../recoil/atoms/authAtom"
import { fetchUserDetailsApi, forgotPasswordApi, loginUserApi, logoutUserApi, registerUserApi, resetPasswordApi , updatePasswordApi, updateProfileApi } from "../api/authApi"
import type { ParsedApiError } from "../types/error.types"
import { globalAxiosErrorHandler, isSessionExpired } from "../error/globalAxiosHandler"
import { useNavigate } from "react-router-dom"


// custom hook to handle all the auth related logics at a single place 
// this is one of the hooks in the hook layer of the frontend application 
// this will interact with the atoms layer and the api layer too 
export const useAuth = () => {
    const navigate = useNavigate()
    // all the recoil related states will come here
    const [user, setUser] = useRecoilState(userAtom)
    const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthenticatedAtom)

    const setIsUserLoggingIn = useSetRecoilState(isUserLoggingInAtom)
    const setIsUserRegistering = useSetRecoilState(isUserRegisteringAtom) 
    const setIsUserLoggingOut = useSetRecoilState(isUserLoggingOutAtom)
    const setIsPasswordChanging = useSetRecoilState(isPasswordChangingAtom)
    const setIsUpdatingProfile = useSetRecoilState(isUpdatingProfileAtom)
    const setIsFetchingUser = useSetRecoilState(isFetchingUserAtom)
    const setAuthError = useSetRecoilState(authErrorAtom)

    /**
     * Function to login the user. 
     * @param payload login related information basically username password
     */
    const loginUser = async (payload : LoginPayload) => {
        // lets first reset the auth error and then set the isUserLoggingIn to true
        setAuthError(null);
        setIsUserLoggingIn(true);
        try{
            // lets make an axios response here to login the user in the application
            const loginResponse = await loginUserApi(payload);
            // say everything went fine and we got the token and the user details in the response 
            // now we need to set the user details in the recoil state and also set the isAuthenticated to true 
            setUser(loginResponse.user);
            setIsAuthenticated(true);
        }catch(err : any) {
            const parsedErrorResponse : ParsedApiError = globalAxiosErrorHandler(err)
            setAuthError(parsedErrorResponse.message);
        } finally {
            // in the finally block we will set the isUserLoggingIn to false 
            setIsUserLoggingIn(false);
        }
    }


    const registerUser = async (payload : RegisterPayload) => {
        setAuthError(null);
        setIsUserRegistering(true);
        try{
            // lets make an axios response here to register the user in the application
             const registerResponse = await registerUserApi(payload);
             // say everything went fine and we got the token and the user details in the response 
             // now we need to set the user details in the recoil state and also set the isAuthenticated to true 
             setUser(registerResponse.user);
             setIsAuthenticated(true);
        }catch(err : any) {
            const parsedErrorResponse : ParsedApiError = globalAxiosErrorHandler(err)
            setAuthError(parsedErrorResponse.message);
        } finally {
            setIsUserRegistering(false);
        }
    }



    const logoutUser = async () => {
        setAuthError(null);
        setIsUserLoggingOut(true);
        try{
            // lets make an axios response here to logout the user from the application
            await logoutUserApi({});
            // say everything went fine and we have successfully logged out the user 
            // now we need to set the user details in the recoil state to null and also set the isAuthenticated to false 
            setUser(null);
            setIsAuthenticated(false);
        }catch(err : any) {
            const parsedErrorResponse : ParsedApiError = globalAxiosErrorHandler(err);
            setAuthError(parsedErrorResponse.message);
            // even though we have got an error while logging out but still 
            // lets hypothetical log out the user from the website 
            setIsAuthenticated(false)
            setUser(null);
        } finally {
            setIsUserLoggingOut(false);
        }
    }


    const forgotPassword = async (payload : ForgotPasswordPayload) => {
        setAuthError(null);
        try{
            // lets make an axios response here to send the forgot password email to the user
            await forgotPasswordApi(payload);
            // say everything went fine and we have successfully sent the forgot password email to the user 
        }catch(err : any) {
            const parsedErrorResponse : ParsedApiError = globalAxiosErrorHandler(err)
            setAuthError(parsedErrorResponse.message);
        } 
    }


    const resetPassword = async (payload : ResetPasswordPayload) => {
        setAuthError(null);
        try{ 
            console.log("The payload that we are sending for reset passsword to the backend\n", payload)
            // lets make an axios response here to reset the password of the user
            await resetPasswordApi(payload);
            // say everything went fine and we have successfully reset the password of the user 
             // now we can simply logout the user from the application for security purposes
             await logoutUserApi({});
             setUser(null);
             setIsAuthenticated(false);
        }catch(err : any) {
            const parsedErrorResponse : ParsedApiError = globalAxiosErrorHandler(err)
            setAuthError(parsedErrorResponse.message);
            console.log("The error that we got while hitting the reset password api is : \n", parsedErrorResponse.message);
        } 
    }


    const updatePassword = async (payload : UpdatePasswordPayload) => {
        setAuthError(null);
        setIsPasswordChanging(true);
        try{
            console.log("The payload to update the password that we are sending is \n", payload)
            // lets make an axios response here to change the password of the user 
                await updatePasswordApi(payload);
            // say everything went fine and we have successfully changed the password of the user
             // now we can simply logout the user from the application for security purposes 
             await logoutUserApi({});
             setUser(null);
             setIsAuthenticated(false);
        }catch(err : any) {
            const parsedErrorResponse : ParsedApiError = globalAxiosErrorHandler(err)
            setAuthError(parsedErrorResponse.message);
            console.log("The error occurred while updating the password of the user with message : \n", parsedErrorResponse.message)
        } finally {
            setIsPasswordChanging(false);
        }
    }



    const updateProfile = async (payload : UpdateProfilePayload) => {
        setAuthError(null);
        setIsUpdatingProfile(true);
        try{
            // lets make an axios response here to update the profile of the user
            // we will get the updated user details in the response 
            const updateProfileResponse = await updateProfileApi(payload);
            // say everything went fine and we have lsuccessfully updated the profile of the user
             // now we need to set the user details in the recoil state with the updated user details 
             setUser(updateProfileResponse.user);
        }catch(err : any) {
            const parsedErrorResponse : ParsedApiError = globalAxiosErrorHandler(err)
            if(isSessionExpired(parsedErrorResponse)) {
                // this means that the user has logged out
                setUser(null);
                setIsAuthenticated(false)
                // then redirect user to the login page 
                navigate("/")
            }
            setAuthError(parsedErrorResponse.message);   // ✅ removed duplicate setAuthError(err.message)
            console.log("Some error occurred while updating the user profile with error messaghe : ", parsedErrorResponse.message);
        } finally {
            setIsUpdatingProfile(false);
        }
    }



    const fetchUserDetails = async () => {
        setAuthError(null);
        setIsFetchingUser(true);
        try{
            // lets make an axios response here to fetch the details of the user
            // we will get the user details in the response 
            const userDetailsResponse = await fetchUserDetailsApi();
            // say everything went fine and we have successfully fetched the details of the user
            // now we need to set the user details in the recoil state with the fetched user details and also set the isAuthenticated to true 
            // console.log("Inside fetch user details api in use auth : - \n", userDetailsResponse)
            // if(userDetailsResponse.user)
            setUser(userDetailsResponse.user);
            setIsAuthenticated(true);
        }catch(err : any) {
            const parsedErrorResponse : ParsedApiError = globalAxiosErrorHandler(err)
            if(isSessionExpired(parsedErrorResponse)) {
                // this means that the user session expired. 
                setUser(null);
                setIsAuthenticated(false);
                // navigate("/")                
            }
            setAuthError(parsedErrorResponse.message);
        } finally {
            setIsFetchingUser(false);
        }
    }

    return {
        user, 
        isAuthenticated, 
        loginUser, 
        registerUser, 
        logoutUser, 
        updatePassword, 
        updateProfile, 
        fetchUserDetails,
        forgotPassword, 
        resetPassword
    }
}