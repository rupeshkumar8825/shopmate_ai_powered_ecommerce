// here we will handle all the token CRUD operations in the local storage 

/**
 * Gets the token from the local storage
 * @returns the token string if it exists, otherwise null
 */
export const getToken = () => {
    return localStorage.getItem('token');
}


/**
 * Given a token string, it sets the token in the local storage
 * @param token to be set 
 */
export const setToken = (token: string) => {
    localStorage.setItem('token', token);
}


/**
 * Removes the token from the local storage, effectively logging the user out
 */
export const removeToken = () => {
    localStorage.removeItem('token');
}