// code to setup the nodemailer and then send the email with proper content
import nodemailer from "nodemailer"
import { ENV } from "../config/env"


export const sendEmail = async (email : string, subject : string, message : string) => {
    const transporter = nodemailer.createTransport({
        host : ENV.SMTP_HOST, 
        service : ENV.SMTP_SERVICE, 
        port : ENV.SMTP_PORT, 
        auth : {
            user : ENV.SMTP_MAIL, 
            pass : ENV.SMTP_PASSWORD
        }
    })

    // lets define the email options
    const mailOptions = {
        from : ENV.SMTP_MAIL, 
        to : email, 
        subject : subject, 
        html : message
    }

    // now lets send the email to the user 
    const sendMailResponse = await transporter.sendMail(mailOptions)


}