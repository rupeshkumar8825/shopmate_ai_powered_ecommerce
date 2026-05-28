// this is the auth related hooks which is responsible for handling all the authentication related logic
// the advantage of using hooks is that we will be able to use this at many place 
// its like the function where we write code once and then can use this at multiple places

import { useRecoilState, useSetRecoilState } from "recoil"
import type { LoginPayload, RegisterPayload } from "../types/auth.types"
import { authErrorAtom, isAuthenticatedAtom, isFetchingUserAtom, isPasswordChangingAtom, isUpdatingProfileAtom, isUserLoggingInAtom, isUserLoggingOutAtom, isUserRegisteringAtom, userAtom } from "../recoil/atoms/authAtom"
import { loginUser, loginUserApi, logoutUserApi, registerUserApi } from "../api/authApi"


// custom hook to handle all the auth related logics at a single place 
// this is one of the hooks in the hook layer of the frontend application 
// this will interact with the atoms layer and the api layer too 
export const useAuth = () => {
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
            setAuthError(err.message);
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
            setAuthError(err.message);
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
            setAuthError(err.message);
        } finally {
            setIsUserLoggingOut(false);
        }
    }

    const changePassword = async () => {
        setAuthError(null);
        setIsPasswordChanging(true);
        try{
            // lets make an axios response here to change the password of the user 
        }catch(err : any) {
            setAuthError(err.message);
        } finally {
            setIsPasswordChanging(false);
        }
    }


    
    const updateProfile = async () => {

    }

    const fetchUserDetails = async () => {

    }

    return {
        user, 
        isAuthenticated, 
        loginUser, 
        registerUser, 
        logoutUser, 
        changePassword, 
        updateProfile, 
        fetchUserDetails
    }
}