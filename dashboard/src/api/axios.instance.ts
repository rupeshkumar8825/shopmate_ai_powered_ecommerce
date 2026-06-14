// this creates the instance of an axios with some pre-set settings to avoid code duplication 
// in all the api layers 

import axios from "axios";

const BACKEND_URL = "http://localhost:4000"

export const axiosInstance = axios.create({
    baseURL : BACKEND_URL,
    withCredentials : true,
    headers : {
        "Content-Type" : "application/json"
    }, 
    timeout : 30000 // 30 second time out for this case 
})