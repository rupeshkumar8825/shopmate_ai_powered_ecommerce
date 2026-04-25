// this is the cloudinary setup file
import {v2 as cloudinary} from "cloudinary"
import { ENV } from "./env"

cloudinary.config({
    cloud_name : ENV.CLOUDINARY_CLIENT_NAME,
    api_key : ENV.CLOUDINARY_CLIENT_API,
    api_secret : ENV.CLOUDINARY_CLIENT_SECRET
})

// say everything went fine 
export default cloudinary