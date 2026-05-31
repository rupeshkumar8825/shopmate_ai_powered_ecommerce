// single file to handle and manage all the auth headers and error handling for the API calls using axios. This will help to keep the code clean and organized.    

import axios from "axios";

const BACKEND_URL = "http://localhost:4000"

// settings the base URL, default headers, and timeout settings all in one place
// with an instance. These settings are automatically passed or applied on to every request
// made through that instance. 
const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials : true,
    timeout: 30000, // 30 seconds timeout for all requests
});

export default axiosInstance;