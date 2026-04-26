// file having all the service functions related to the product 

import fileUpload from "express-fileupload";
import prisma from "../config/prisma";
import AppError from "../middlware/errorHandler";
import { StatusCodes } from "../error/statusCodes";
import { Product } from "../generated/prisma/client";
import { CloudinaryService } from "./cloudinary.service";
import { ProductWhereInput } from "../generated/prisma/models";

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
                    const avatar : avatarType = {
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


    // service layer function to fetch the list of all the products
    static async fetchAllProductsService(availability : string|undefined, minPrice : number|undefined, maxPrice : number|undefined, minRating : number|undefined, maxRating : number|undefined, search : string|undefined, category : string|undefined, page : number|undefined) {

        // based on the filters we need to frame the prisma query to be passed
        page = page ?? 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const andQueries = [];
        if(availability === "in-stock"){
            andQueries.push({stock : {gt : 5}})
        }else if (availability === "limited"){
            andQueries.push({stock : {lte : 5, gt : 0}})
        }else if (availability === "out-of-stock"){
            andQueries.push({stock : 0})
        }

        // lets accomodate the query for the price filter 
        if(minPrice){
            andQueries.push({price : {gte : minPrice}})
        }
        if(maxPrice){
            andQueries.push({price : {lte : maxPrice}})
        }

        // lets accomodate the query for the search keyword in this case 
        if(search){
            andQueries.push({
                OR : [
                    {name : {contains : search, mode: "insensitive"}}, 
                    {description : {contains : search, mode: "insensitive"}}
                ]   
            })
        }

        // lets accomodate the rating related filters 
        if(minRating){
            andQueries.push({rating : {gte : minRating}})
        }
        if(maxRating){
            andQueries.push({rating : {lte : maxRating}})
        }

        // handle the category related filter
        if(category){
            andQueries.push({category : {contains : category, mode : "insensitive"}})
        }
        let whereInput = {};
        // lets check whether if there are any conditions at all or not 
        if(andQueries.length != 0){
            // then this means that we will have to just return the value 
            whereInput = {
                AND : andQueries
            }
        }
        console.log(`(${new Date()})[ProductService, fetchAllProductService] :- The where input for prisma is as follows \n ${whereInput}`)
        // now based on the above conditions and filter now lets try to find 
        // out the list of the products  
        const allProductList = await prisma.product.findMany({
            where : whereInput
        });

        const totalNumberOfProducts = allProductList.length;

        // now we need to fetch the complete details along with the reviews too 
        const allProductListWithReviews = await prisma.product.findMany({
            where : whereInput, 
            skip : skip, 
            take : limit, 
            include : {
                reviewList : true // this will include all the fields of the review list
            }
        })

        let thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        // now find the list of products who were created newly in the last 30 days 
        let newlyCreatedProductList = await prisma.product.findMany({
            where : {created_at : {gte : thirtyDaysAgo}}, 
            orderBy : {created_at : "desc"}, 
            take : 10, 
            include : {
                reviewList : true, 
                _count : {
                    select : {reviewList : true},
                }
            },
        })

        // now add the alias field for this purpose 
        const newlyCreatedProductListFinal = newlyCreatedProductList.map((currElement) => ({
            ...currElement, 
            review_count: currElement._count.reviewList, 
            _count : undefined
        }))


        // now lets find the top rated products in the database for this purpose
        const topRatedProductList = await prisma.product.findMany({
            where : {ratings : {gte : 4.5}}, 
            orderBy : {ratings : "desc"}, 
            take : 10, 
            include : {
                reviewList : true, 
                _count : {
                    select : {reviewList : true}
                }
            }
        })

        const topRatedProducts = topRatedProductList.map((p) => ({
            ...p,
            review_count: p._count.reviewList,
            _count: undefined,
        }));


        // say everything went fine 
        return [totalNumberOfProducts, allProductList, newlyCreatedProductListFinal, topRatedProducts];

    }

    static async getProductService () {

    }


    static async deleteProductService () {

    }

    static async getListOfAllProductsGivenUserService () {

    }
}