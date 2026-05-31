// this is the global axios error handler at a single place
// we will handle the error properly for this purpose 

import { isAxiosError } from "axios";
import type { ParsedApiError, ServerErrorResponse } from "../types/error.types";

export const globalAxiosErrorHandler = (error : any) : ParsedApiError => {
    // check if this is axios response
    if(isAxiosError(error)){
        // this means that this is the axios response 
        const serverError  = error.response?.data as ServerErrorResponse | undefined;
        const serverMessage = serverError?.message;
        const serverUniquCode = serverError?.uniqueCode ?? "UNKNOWN";

        // Case 1 : Server responded with a non-2xx status 

        if(error.response){
            const status = error.response.status;
            
 
            const fallbackMessages: Record<number, string> = {
                401: "Session expired. Please log in again.",
                403: "You don't have permission to perform this action.",
                404: "The requested resource was not found.",
                409: "A conflict occurred (e.g. email already in use).",
                422: "Validation failed. Please check your input.",
                429: "Too many attempts. Please wait and try again.",
                500: "Something went wrong on our end. Please try again later.",
            };

            // say everything went fine
            return {
                uniqueCode : serverUniquCode, 
                message : serverMessage ?? fallbackMessages[status] ?? `Unexpected Error ${status}`, 
                statusCode : status
            }
        }

        // CASE 2 : Request was sent but no response received 
        // server is down , no internet, or request timed out
        if(error.request){
            if(error.code === "ECONNABORTED"){
                return {
                    uniqueCode : "ECONNABORTED", 
                    message : "Request timed out. Please try again", 
                    statusCode : error.status ?? 0
                }
            }

            // otherwise this is network error
            return {
                uniqueCode : "NETWORK_ERROR", 
                message : "Unable to reach the server. Please check your internet connection", 
                statusCode : error.status?? 0
            }
        }
    }



    // lets handle now the API level errors meaning the errors which will be throwed
    // by the API layer of the fronteend application for this purpose
    if(error instanceof Error){
        if(error.message === "EMPTY_RESPONSE"){
            return {
                uniqueCode : "EMPTY_RESPONSE", 
                message : "Server returned an empty response. Please try again.", 
            }
        } else if (error.message === "INVALID_RESPONSE") {
            return {
                uniqueCode : "INVALID_RESPONSE", 
                message : "Received an unexpected response from the server.", 
            }
        }

        // otherwise this is some unknown error thrown by the API layer implemented in the frontend 
        // application for this purpose
        return {
            uniqueCode : "UNKNOWN", 
            message : error.message, 
        }
    }

    // completely unknown error received 
    // say everything went fine 
    return {
        uniqueCode : "UNKNOWN", 
        message : "An expected error occurred. Please try again,"
    }

}