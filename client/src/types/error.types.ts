// this consists of the types related to the errors that we have 
export interface ParsedApiError {
    uniqueCode : string, 
    message : string,  
    statusCode? : number
}


export interface ServerErrorResponse {
    message : string, 
    uniqueCode : string, 
    success : boolean
}