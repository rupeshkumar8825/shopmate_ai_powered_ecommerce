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
        const userId : string = request.userId ?? "";
        
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


    // controller function to get the list of all the products in detail 
    // note that this controller name is slightly misleading. 
    // in this we fetch all the products that matches the filter
    static async fetchAllProductsController(request : Request, response : Response) {
        // lets read about the different filters that we have to apply before
        // fetching the list of the products. 
        // assume that the basic validation would be done by the zod itself
        const availability = request.query.availability? request.query.availability as string : undefined;
        const minPrice = request.query.minPrice? parseInt(request.query.minPrice as string) : undefined;
        const maxPrice = request.query.maxPrice? parseInt(request.query.maxPrice as string) : undefined;
        const category = request.query.category? request.query.category as string : undefined;
        const minRating : number|undefined = request.query.minRating? parseFloat(request.query.minRating as string) : undefined;
        const maxRating : number|undefined = request.query.maxRating? parseFloat(request.query.maxRating as string) : undefined;
        const search = request.query.search? request.query.search as string : undefined;
        const page : number|undefined = request.query.page? parseInt(request.query.page as string) : undefined;

        
        const [totalNumberOfProducts, allProductList, newlyCreatedProductListFinal, topRatedProducts] = await ProductService.fetchAllProductsService(availability, minPrice, maxPrice, minRating, maxRating, search, category, page);

        // control reaches means this executed perfectly right 
        // lets return an positive response to the user 
        response.status(StatusCodes.SUCCESS_200).json({
            success : true,
            message : "Successfully fetched all products", 
            totalNumberOfProducts : totalNumberOfProducts, 
            productList : allProductList, 
            newlyCreatedProductList : newlyCreatedProductListFinal, 
            topRatedProducts : topRatedProducts
        })
    }

    static async getProductController() {

    }


    static async deleteProductController() {

    }


    // controller to fetch the list of all the products created by a user
    static async getListOfAllProductsGivenUserController() {
        
    }
}