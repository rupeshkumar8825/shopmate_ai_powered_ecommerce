// all the types related to the authentication of the user comes here

// defining teh register payload to be sent to the backend server 
export type RegisterPayload = {
    name : string, 
    email : string, 
    password : string
}


// type for defining the payload to be sent to the backend server 
// for logging into the application
export type LoginPayload = {
    email : string, 
    password : string
}


// type for defining the payload to be sent to the backend server
// for logging out of the application 
export type LogPayload = {

}