// single file to handle and manage all the auth headers and error handling for the API calls using axios. This will help to keep the code clean and organized.    

import axios from "axios";


// settings the base URL, default headers, and timeout settings all in one place
// with an instance. These settings are automatically passed or applied on to every request
// made through that instance. 
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout for all requests
});

export default axiosInstance;