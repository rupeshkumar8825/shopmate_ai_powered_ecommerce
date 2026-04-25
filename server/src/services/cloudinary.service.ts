// file consisting of all the utils functions to upload, fetch, update, transform 
// the media files 
import { UploadedFile } from "express-fileupload";
import cloudinary from "../config/cloudinary";
import AppError from "../middlware/errorHandler";
import { StatusCodes } from "../error/statusCodes";
import fs from "fs/promises"

// lets define our custom interface/type here for this purpose 
type CloudinaryUploadResult = {
    public_id : string, 
    url : string
};

type Options = {
    folder? : string, 
    width? : number, 
    crop? : string
}


// function to upload the file
// given the options this function also transform the image for this purpose
async function uploadToCloudinaryService (file : UploadedFile, options? : Options ) : Promise<CloudinaryUploadResult> {
    // lets do some of the validations here for this purpose
    if(!file.tempFilePath) {
        // this happens we do not use the temp file path 
        throw new AppError("tempFilePath is missing. Enable useTempFiles : true in express-fileupload middleware", StatusCodes.BAD_REQUEST_400)
    }

    // lets use try catch here because we need to handle the error here 
    // to delete the temp files after the operations succeeds or fails for this purpose
    let fileUploadResult = null;
    try{
        fileUploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
        folder : options?.folder ?? "uploads", 
        width : options?.width, 
        crop : options?.crop, 
        resource_type : "image",
    })
    }
    catch(error){
        // some exception occurred we will simply throw the exception to the 
        // error middleware 
        throw new AppError(`File upload failed with error message`, StatusCodes.INTERNAL_ERROR_500);
    }
    finally{
        // delete the temp file otherwise the laptop or the server's temp file will 
        // get full and can have issues in future for this purpose
        await fs.unlink(file.tempFilePath).catch(() => {})
    }

    

    // if the control reaches here this means that there was no error which occurred 
    // hence lets directly get the result
    const resultToReturn : CloudinaryUploadResult = {
        public_id : fileUploadResult.public_id, 
        url: fileUploadResult.url
    }


    // before returning from here we need to use the 
    // say everything went fine 
    return resultToReturn;
}