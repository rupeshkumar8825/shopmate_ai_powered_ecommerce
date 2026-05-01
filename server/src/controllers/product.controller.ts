// this will have all the controllers which are required for handling all the product 
// related things

import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { StatusCodes } from "../error/statusCodes";

export class ProductController {
    // controller function to create the product
    static async createProductController (request : Request, response : Response) {
        // TODO : need to add ZOD validation in the project so that 
        // we avoid directly accessing the values from the request object
        // as we cannot trust the values from the client side. 
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


    // controlle to handle the update product related actions
    static async updateProductController(request : Request, response : Response) {
        // following things can be updated by the admin user 
        // 1. name
        // 2. description
        // 3. price 
        // 4. category
        // 5. images 
        // 6. stock
        const productId : string = request.params.productId? request.params.productId as string : "";
        const updatedProductName : string = request.body.name? request.body.name as string : "";
        const updatedDescription = request.body.description? request.body.description as string : "";
        const updatedPrice : number|undefined = request.body.price? parseFloat(request.body.price as string) : undefined;
        const category = request.body.category? request.body.category as string : "";
        const images = request.files? request.files : undefined;
        const stock = request.body.stock? parseInt(request.body.stock as string) : undefined;
        
        // lets call the service layer function
        const updatedProduct = await ProductService.updateProductService(productId, updatedProductName, updatedDescription, updatedPrice, category, images, stock);

        // if the control reaches here then this means that the product updated was successfull. 
        // lets return the positive response to the user. 
        response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "Product updated successfully", 
            updatedProduct : updatedProduct
        });
    }



    // controller function to handle the delete product
    // this will internally calls the service function
    static async deleteProductController(request : Request, response : Response) {
        // get the input data
        // TODO : add the zod validation 
        // since we do not have the zod validation yet hence we will simply use 
        // our custom made validation
        let productId : string = "";
        if(!request.params.productId){
            //this is not defined hence lets return the bad response hence itself 
            return response.status(StatusCodes.BAD_REQUEST_400).json({
                success : false, 
                message : "Product id is not defined"
            }); 
        }else if (Array.isArray(request.params.productId)){
            // this means that we received an array of params 
            // this is not expected, hence lets return a negative response to the client
            return response.status(StatusCodes.BAD_REQUEST_400).json({
                success : false, 
                message : "Product Id not found"
            });
        }

        // if control reaches here this means that we have got the correct parameter format 
        productId = request.params.productId; 

        // need to pass this to the service layer function to actually delete the product
        await ProductService.deleteProductService(productId);

        // if the control reaches here then we are sure that the product is not deleted
        // say everything went fine 
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "Product deleted successfully."
        });
    }



    // controller to get the single product given the product id
    static async getSingleProductController(request : Request, response : Response) {
        let productId : string = "";

        if(!request.params.productId){
            // the product id is not defined at all 
            // lets return a negative response
            return response.status(StatusCodes.BAD_REQUEST_400).json({
                success : false, 
                message : "Product Id not found"
            });
        }else if (Array.isArray(request.params.productId)){
            // this is the array but we expected a single string argument
            // something is wrong lets pass a negative response 
            return response.status(StatusCodes.BAD_REQUEST_400).json({
                success : false, 
                message : "Product id not found"
            });
        }

        // otherwise we can consider the value as product id 
        productId = request.params.productId;

        // call the service layer function here 
        const productResponse = await ProductService.getProductService(productId);

        // control reaches here meaning we have got the product that we wanted from DB. 
        // say everything went fine and return a positive response
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "Product details found successfully.", 
            productDetails : productResponse
        })
    }


    // controller function to post a review for a given product
    static async postProductReviewController(request : Request, response : Response) {
        const userId : string|undefined = request.userId;
        const rating : number|undefined = request.body.rating ? parseFloat(request.body.rating) : undefined;
        const comment : string = request.body.comment ? request.body.comment : "";

        // lets get the product id first from the request params
        let productId : string = "";
        if(!request.params.productId){
            // this is not defined at all hence lets return a negative response for this purpose 
            return response.status(StatusCodes.BAD_REQUEST_400).json({
                success : true, 
                message : "ProductId could not be found"
            });
        }else if(Array.isArray(request.params.productId)){
            // we are expecting a string but we got string[].
            // hence lets return a negative response 
            return response.status(StatusCodes.BAD_REQUEST_400).json({
                success : true, 
                message : "Product Id not defined"
            });
        }else {
            // this means that we have found the correct product id 
            productId = request.params.productId;
        }

        // call the service layer function here 
        const [reviewResponseToReturn, updatedProductResponse] = await ProductService.postProductReviewService(userId, rating, comment, productId);

        // if control reaches here this means that we have successfully posted the review 
        // say everything went fine 
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "Review added successfully.", 
            review : reviewResponseToReturn, 
            product : updatedProductResponse
        });


    }


    // controller function to delete a review of a product given by the user
    static async deleteReviewController (request : Request, response : Response){
        const userId : string | undefined = request.userId;
        if(!request.params.productId){
            // this means that the productId is null lets return a negative response to the user 
            return response.status(StatusCodes.BAD_REQUEST_400).json({
                success : false, 
                message : "Product Id not found"
            });
        }else if (Array.isArray(request.params.productId)) {
            return response.status(StatusCodes.BAD_REQUEST_400).json({
                success : false,
                message : "ProductId not found"
            });
        }

        const productId : string|undefined = request.params.productId;

        // call the service layer function 
        const updatedProductResponse = await ProductService.deleteReviewService(userId, productId);
        // if control reaches here this means that the delete review api ran well. 
        // lets return a positive response i.e. say everything went fine 
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true,
            message : "Your review has been deleted",
            product : updatedProductResponse
        });
    }

    static async fetchAIFilteredProductsController (request : Request, response : Response) {
        // since this is based on the ai hence we must expect the user prompt
        // in the request body 
        const userId = request.userId;
        const userPrompt = request.body.userPrompt;

        // lets call the service layer function here 
        const listOfProducts = await ProductService.fetchAIFilteredProductsService(userId, userPrompt);

        // if control reaches here then this means that the api ran successfully 
        // lets return the positive response to the client application itself 
        // say everything went fine 
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "Successfully fetched AI filtered products", 
            productList : listOfProducts
        });
    }

}