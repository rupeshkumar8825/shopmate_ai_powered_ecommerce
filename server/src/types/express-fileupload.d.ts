// lets modify the type of the express-fileupload to accomodate the list of files 
import "express-fileupload"
import type fileUpload from "express-fileupload"

declare global {
    namespace Express {
        interface Request {
            files?: fileUpload.FileArray | null
        } 
    }
}

// say eveything went fine 
export {};