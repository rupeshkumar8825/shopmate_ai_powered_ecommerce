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
    }
)


export const ENV = envSchema.parse(process.env)