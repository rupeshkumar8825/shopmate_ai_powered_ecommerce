// we will use the zod for the validation of the difference present environment variables
import z from "zod"


const envSchema = z.object(
    {
        PORT : z.string().optional(), 
        FRONTEND_URL : z.string(), 
        DASHBOARD_URL : z.string(),
        JWT_SECRET_KEY : z.string(),
        JWT_EXPIRES_IN : z.string(),
        COOKIE_EXPIRES_IN : z.string().transform((val) => Number(val)),
        SMTP_HOST : z.string(), 
        SMTP_SERVICE : z.string(), 
        SMTP_PORT : z.string(), 
        SMTP_MAIL : z.string(), 
        SMTP_PASSWORD : z.string(), 
        CLOUDINARY_CLIENT_NAME : z.string(), 
        CLOUDINARY_CLIENT_API : z.string(), 
        CLOUDINARY_CLIENT_SECRET : z.string()

    }
)


export const ENV = envSchema.parse(process.env)