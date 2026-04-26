// this will have all the controllers which are required for handling all the product 
// related things

import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { StatusCodes } from "../error/statusCodes";

export class ProductController {
    // controller function to create the product
    static async createProductController (request : Request, response : Response) {
        // consider that the data from user is already validated using zod
        // lets start using the data as it is
        const productName : string = request.body.name;
        const description : string = request.body.description; 
        // note that the using parseFloat may not be ideal. Either its better to use 
        // zod validation or use a stricter float parsing thing
        // but for now lets use this function and store it in the number datatype as
        // numbers can store the integer as well as the float values.
        const price : number = parseFloat(request.body.price);
        const category : string = request.body.category; 
        const files = request.files;
        const stock : number = parseInt(request.body.stock)
        const userId : string = request.body.userId
        
        // lets pass all these to the service layer
        const createProductResponse = await ProductService.createProductService(userId, productName, description, price, category, files, stock);

        // if control reaches here this means that the product creation is working great
        // lets return the positive response to the client for this purpose. 
        response.status(StatusCodes.CREATED_201).json({
            success : true, 
            message : "Product created successfully", 
            product : createProductResponse
        });

    }


    static async getProductController() {

    }


    static async deleteProductController() {

    }

    static async getListOfAllProductsGivenUserController() {

    }
}