// file having all the service functions related to the product 

import fileUpload from "express-fileupload";
import prisma from "../config/prisma";
import AppError from "../middlware/errorHandler";
import { StatusCodes } from "../error/statusCodes";
import { Product } from "../generated/prisma/client";

export class ProductService {


    // service function to create the product and add it into the database
    static async createProductService (productName : string, description : string, price : number, category : string, 
        images : fileUpload.FileArray | null | undefined, stock : number
    ) {

        // basic validations and checks comes here 

        if(!productName || !description || !price || !stock || !category
            || (productName.trim().length == 0) || (description.trim().length == 0) 
            || (category.trim().length == 0) || (price < 0) || (stock < 0))
        {
            // the input values are not valid hence lets throw an error 
            throw new AppError("One or more input fields are invalid", StatusCodes.BAD_REQUEST_400)   
        }

        productName = productName.trim();
        description = description.trim();
        category = category.trim();

        // upload the product images on the cloudinary 

        // update the database
        const createdProduct : Product|null = null;
        // const createdProduct = await prisma.product.create({
        //     data : {
        //         name : productName, 
        //         description : description, 
        //         price : price, 
        //         category : category,
        //         ratings : 0, 

        //     }
        // })

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