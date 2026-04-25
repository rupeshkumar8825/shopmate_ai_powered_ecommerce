// file having all the service functions related to the product 

import fileUpload from "express-fileupload";
import prisma from "../config/prisma";
import AppError from "../middlware/errorHandler";
import { StatusCodes } from "../error/statusCodes";
import { Product } from "../generated/prisma/client";
import { CloudinaryService } from "./cloudinary.service";

type avatarType = {
    public_id : string, 
    url : string
}

export class ProductService {


    // service function to create the product and add it into the database
    static async createProductService (userId : string, productName : string, description : string, price : number, category : string, 
        files : fileUpload.FileArray | null | undefined, stock : number
    ) {

        // basic validations and checks comes here 

        if(!userId || !productName || !description || !price || !stock || !category
            || (productName.trim().length == 0) || (description.trim().length == 0) 
            || (category.trim().length == 0) || (price < 0) || (stock < 0))
        {
            // the input values are not valid hence lets throw an error 
            throw new AppError("One or more input fields are invalid", StatusCodes.BAD_REQUEST_400)   
        }

        // lets find the user with the given id 
        const currentUser = await prisma.user.findUnique({
            where : {id : userId}
        })
        if(!currentUser)
        {
            // throw an error 
            throw new AppError("User not found ", StatusCodes.NOT_FOUND_404)
        }

        productName = productName.trim();
        description = description.trim();
        category = category.trim();
        let uploadedImages : avatarType[]  = []
        // check if the user has uploaded any images or not 
        if(files && files.images){
            // upload the product images on the cloudinary 
            const images = Array.isArray(files.images)? files.images : [files.images]

            // lets upload each one of the images to cloudinary
            images.forEach(async function(element) {
                const cloudinaryUploadResponse  = await CloudinaryService.uploadToCloudinaryService(element, {
                    folder : "product", 
                        width : 150, 
                        crop : "scale"
                    })
                    const avatar :avatarType = {
                        public_id : cloudinaryUploadResponse.public_id, 
                        url : cloudinaryUploadResponse.url
                    }
                    uploadedImages.push(avatar)
            });


        }else {
            console.log("No product images were uploaded")
            // lets continue and keep going. we should not exit here.
        }
        

        // update the database
        const createdProduct = await prisma.product.create({
            data : {
                name : productName, 
                description : description, 
                price : price, 
                category : category,
                ratings : 0, 
                images : uploadedImages, 
                created_by : currentUser.id, 
                stock : stock, 
            }
        })

        // return the response to the controller layer 
        // say everything went fine 
        return createdProduct;
    }

    static async getProductService () {

    }


    static async deleteProductService () {

    }

    static async getListOfAllProductsGivenUserService () {

    }
}