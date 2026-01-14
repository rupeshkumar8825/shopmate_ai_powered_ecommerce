// define here the environment variables
// do note that we will be using the zod validation for the environment
// variables as well 
import z from "zod"

// all the environment variables will be kept here for this purpose
const envSchema = z.object(
    {
        DATABASE_URL : z.string(), 
        PORT : z.string().optional(),
    }
) ;

export const ENV = envSchema.parse(process.env);