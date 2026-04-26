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
            // lets log the values that we have received from the server
            console.log(`[Product Service, createProductService]:- The received values are : UserId-${userId}
                , productName-${productName}, description-${description}, stock-${stock}, price-${price}, category-${category} `)
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
            console.log(`(${new Date()})[ProductService, createService] :- Got the files and files.images object`)
            // upload the product images on the cloudinary 
            const images = Array.isArray(files.images)? files.images : [files.images]
            console.log(`(${new Date()})[ProductService, createService] :- The list of received images are : ${images}`)
            // lets upload each one of the images to cloudinary
            for(const element of images){
                const cloudinaryUploadResponse  = await CloudinaryService.uploadToCloudinaryService(element, {
                    folder : "product", 
                        width : 150, 
                        crop : "scale"
                })
                // check whether the upload was successfull or not 
                if(!cloudinaryUploadResponse.public_id || !cloudinaryUploadResponse.url)
                {
                    // if any of the fields are empty then we know that the upload was
                    // not successfull. In this case we will simply log on the server and continue 
                    console.log("The upload to cloudinary failed for this product image")
                    
                }else {
                    const avatar :avatarType = {
                        public_id : cloudinaryUploadResponse.public_id, 
                        url : cloudinaryUploadResponse.url
                    }
                    uploadedImages.push(avatar)
                }
            };


        }else {
            console.log(`(${new Date()})[ProductService, createService] :- the files or the files.images field not found. Files - ${files}`)
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