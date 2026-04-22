// this file will consists of all the utilities related functions needs to be done on password 
import crypto from "crypto"

// function to generate the reset token, hashed token and the expiry time which 
// will be required when the user wants to reset the password. 
// using a short lived token for reseting the password is one of the very good 
// secure system.
export const generatePasswordResetToken = () => {
    const resetToken = crypto.randomBytes(20).toString("hex")
    
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    const resetPasswordTokenExpiry = Date.now() + 15 * 60 * 1000 // expired in 15 minutes 
    
    const dataToReturn = {
        resetToken : resetToken, 
        hashedToken : hashedToken, 
        resetPasswordTokenExpiry : resetPasswordTokenExpiry
    }
    // say everything went fine 
    return dataToReturn
}



// utility function to check the resetPasswordToken and hashedPasswordToken matches or not
export const verifyPasswordResetToken = (resetPasswordToken : string, hashedPasswordToken : string) => {
    // lets hash the current reset token 
    const hashedPasswordTokenToVerify = crypto.createHash("sha-256").update(resetPasswordToken).digest("hex");

    if(hashedPasswordTokenToVerify === hashedPasswordToken)
    {
        // say everything went fine
        return true;
    }

    // token mismatched happened 
    return false;

}


// given a normal token its returns the hashed token
export const getHashedResetPasswordToken = (resetPasswordToken : string) => {
    const hashedResetPasswordToken = crypto.createHash("sha-256")
                                    .update(resetPasswordToken)
                                    .digest("hex")

    // say everything went fine 
    return hashedResetPasswordToken;
}