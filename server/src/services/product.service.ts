// file having all the service functions related to the product 

import fileUpload, { FileArray } from "express-fileupload";
import prisma from "../config/prisma";
import AppError from "../middlware/errorHandler";
import { StatusCodes } from "../error/statusCodes";
import { Product } from "../generated/prisma/client";
import { CloudinaryService } from "./cloudinary.service";
import { ProductWhereInput } from "../generated/prisma/models";
import { BatchPayload } from "../generated/prisma/internal/prismaNamespace";
import { stopWords } from "../config/stopwords";
import { AIService } from "./ai.service";

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
        const createdProduct : Product = await prisma.product.create({
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

    // service function to handle the logic to update the products
    static async updateProductService(productId : string, updatedProductName : string, updatedDescription : string, updatedPrice : number | undefined, category : string, images : FileArray|undefined, stock : number|undefined) {
        // depending on whether the values are valid and defined or not we will 
        // udpate the relevant fields 
        if(!productId){
            // productId itself is bad lets throw an error 
            throw new AppError("Product Id is not defined.", StatusCodes.BAD_REQUEST_400)
        }

        // check here that none of the fields should be empty as even though user would have 
        // updated only one of the fields but still the client application should send 
        // all the required fields. Lets check that
        if(!updatedProductName || !updatedDescription || !updatedPrice || !category
            || !images || !stock){
            // not all the required fields were found hence lets simply 
            // return an error directly. 
            throw new AppError("One or more field either missing or they are null", StatusCodes.BAD_REQUEST_400)
        } 

        // else all the fields are already defined lets update those first 
        // later we will try to upload the images to the cloudinary
        let updatedProduct = await prisma.product.update({
            where : {id : productId}, 
            data : {
                name : updatedProductName, 
                description : updatedDescription, 
                price : updatedPrice, 
                category : category, 
                stock : stock
            }
        })


        // lets first delelete all the images which are currently present in the database 
        const currImageList : avatarType[] = updatedProduct.images as avatarType[];
        console.log(`(${new Date()})[ProductService, updateProductService] :- there were no files which were sent. Hence deleting all from the cloudinary`);

        // use a for loop to delete the files from cloudinary
        for (const currImage of currImageList) {
            try{
                await CloudinaryService.deleteFromCloudinaryService(currImage.public_id)
            }catch(error){
                // due to some reason the delete from cloudinary failed. 
                // let continue 
                console.log(`(${new Date()})[ProductService, updateProductService] : - delete from cloudinary failed. But still moving forward`)
                continue;
            }
        }

        // control reaches here this means that all the values except the images section 
        // lets now upload the images over the cloudinary 
        let cloudinaryResult : avatarType[]= [];
        if(images && images.images){
            // check if its of type of array or not 
            const productImageList = Array.isArray(images.images)? images.images : [images.images]
            // lets use the for loop for this purpose
            for(const productImage of productImageList){
                // lets use the cloudinary service and then try to upload it 
                const uploadResponse = await CloudinaryService.uploadToCloudinaryService(productImage, {
                    folder : "product", 
                    width : 150, 
                    crop : "scale"
                })
                if(!uploadResponse || !uploadResponse.public_id || !uploadResponse.url){
                    // this means the image upload failed. 
                    // we will continue 
                    console.log(`(${new Date})[ProductService, updateProductService] :- Upload to cloudinary failed. But still moving forward`)
                    continue;
                }
                cloudinaryResult.push({
                    public_id : uploadResponse.public_id, 
                    url : uploadResponse.url
                })
            }
        }
        else {
            // just set the cloudinary to empty array for this purpose
            cloudinaryResult = [];
        }

        // lets update the images field of this product 
        updatedProduct = await prisma.product.update({
            where : {id : productId}, 
            data : {
                images : cloudinaryResult
            }
        })

        // say everything went fine 
        return updatedProduct;
    }



    //service layer function to delete the product given the productId
    // validated the productId, finds the product and then deletes it
    // note that this function also deletes the product images which were uploaded 
    // on the cloudinary
    static async deleteProductService (productId : string) {
        if(!productId){
            // this is unexpected, but still we got empty or not defined productId 
            // need to throw an error 
            throw new AppError("Product Id is either null or empty", StatusCodes.BAD_REQUEST_400);
        }

        // else lets fetch the product with this product id 
        const productToDelete = await prisma.product.findUnique({
            where : {id : productId}
        });

        if(!productToDelete){
            // throw an error
            throw new AppError("Product not found", StatusCodes.NOT_FOUND_404);
        }

        // else lets first try to delete the images from the cloudinary itself 
        let cloudinaryImagesList : avatarType[] = productToDelete.images as avatarType[];
        for(const currImage of cloudinaryImagesList){
            // lets call the service from the cloudinary itself 
            try{
                await CloudinaryService.deleteFromCloudinaryService(currImage.public_id);
            }catch(error){
                // this throwed an error meaning some thing went wrong
                // lets continue deleting the other images.
                // ideally here we should implement the retry logic itself. 
                // but for now we will log only 
                console.log(`(${new Date()})[ProductService, deleteProductService] : - Deletion of one of the product images failed with public_id as ${currImage.public_id}`);
                console.log(`(${new Date()})[ProductService, deleteProductService] : - But for now moving ahead to delete the other remaining images`);
            }

        }

        // considering that the images would have deleted by now
        // lets delete the product itself 
        // please note that ideally we must delete all the reviews too from 
        // the reviews table. luckily this will already be handled in the database layer 
        // itself as we have defined a property of oncascade delete. 
        // so no need to handle the deletion of the reviews from application code.
        await prisma.product.delete({
            where : {id : productId}
        })

        // say everything went fine 
        return;
    }


    // service layer function to find a single product
    static async getProductService (produtId : string) {
        if(!produtId){
            // this was unexpected but still lets throw an error in this case
            throw new AppError("Product Id is empty", StatusCodes.BAD_REQUEST_400);
        }

        // we have got the productId to find
        // we need to get the following details about the product : 
        //  1. total number of reviews 
        //  2. average rating of the product
        //  3. 
        const productResponse = await prisma.product.findUnique({
            where : {id : produtId}, 
            include : {
                reviewList : {
                    include : {
                        user : true
                    }
                }
            }
        });

        if(!productResponse){
            // no product was found. Lets throw an error here itself 
            throw new AppError("Product not found", StatusCodes.NOT_FOUND_404);
        }

        // otherwise we have found the product lets simply return this to the controller layer
        return productResponse;
    }

    static async getListOfAllProductsGivenUserService () {

    }


    // service layer function to post a review from the user side
    static async postProductReviewService (userId : string|undefined, rating : number|undefined, comment : string, productId : string){
        // lets validate the product id and other fields here in the service layer itself 
        if(!productId || !userId || !rating){
            // required fields are not sent by the user 
            // lets throw an error for this purpose
            throw new AppError("Some required fields are missing.", StatusCodes.BAD_REQUEST_400);
        }

        // lets check whether product is there or not 
        const productResponse = await prisma.product.findUnique({
            where : {id : productId}
        });

        if(!productResponse){
            // no product exists with the given product id 
            // hence lets throw an error to the client 
            throw new AppError("Product not found.", StatusCodes.NOT_FOUND_404);
        }

        // lets check whether the user has purchased this product or not
        // for this we need to follow the below steps : 
        // 1. Fetch all the orders which are made by this user 
        // 2. Then filter out those orders whose payment was succesfull by the user
        // 3. Given the successfull orders then check for which products these orders were made
        // 4. Find the order item corresponding to this userid and the product id
        // 5. If we are able to find even a single entry in the previous step then we are sure 
        //    that user has purchased this product at least once in the past. 
        //    Hence lets allow the user to give review 
        // 6. Else we will throw an error or return an error message stating that user cannot review
            
        const orderListResponse = await prisma.order.findMany({
            where : {
                buyer_id : userId, 
                payments : {
                    // please note that some here means it will return this order 
                    // if it finds even a single payments with payment status as single 
                    // from all the multiple payments which were done in the past history
                    some : {
                        payment_status : "Paid"
                    }
                }
            }
            
        });
        
        if(!orderListResponse){
            // this means that user do not have any order with successfull payments
            // need to throw an error which will eventually return to the client 
            throw new AppError("User cannot rate this product as he has not purchased it", StatusCodes.NOT_AUTHORIZED_401);
        }

        const orderIds = orderListResponse.map(o => o.id);
        // otherwise we have got the list of all the orders placed by the user 
        // now in the order item lets filter out all the entries where we have the product id 
        const orderItemForGivenProductAndOrders = await prisma.orderItem.findMany({
            where : {
                product_id : productId,
                order_id : {in : orderIds}
            }
        })


        if(!orderItemForGivenProductAndOrders){
            // this means that we are sure that this user has not purchased this product
            // itself. hence lets return the error from this service layer 
            throw new AppError("User has not purchased this product. Hence cannot review", StatusCodes.NOT_AUTHORIZED_401); 
        }

        // if control reaches here this means that user is eligible for reviewing
        // but we need to make one more check which is to make sure that the user has already reviewed the product or not 
        const hasUserAlreadyAddedReview = await prisma.reviews.findMany({
            where : {
                user_id : userId, 
                product_id : productId
            }
        });

        let reviewResponseToReturn = null;

        if(hasUserAlreadyAddedReview){
            // this means that user would want to update thier own old ratings. 
            // lets do that now
            const reviewResponse : BatchPayload = await prisma.reviews.updateMany({
                where : {
                    user_id : userId, 
                    product_id : productId
                }, 
                data : {
                    rating : rating, 
                    comment : comment
                }
            });
            
            if(!reviewResponse){
                // the review update was not successfull due to any reason. 
                // lets try to return an error message
                throw new AppError("Review update failed. Please try again", StatusCodes.INTERNAL_ERROR_500);
            }

            // lets find the updated rating for this product and store it to be returned later. 
            reviewResponseToReturn = await prisma.reviews.findFirst({
                where : {user_id : userId, product_id : productId}
            });

        }else {

            // this means that user has purchased the product and he/she has not yet reviewed  
            // hence lets update the product entry itself with the user's review 
            reviewResponseToReturn = await prisma.reviews.create({
                data : {
                    product_id : productId,
                    user_id : userId, 
                    rating : rating, 
                    comment : comment, 
                }
            });
    
            if(!reviewResponseToReturn){
                // this means that new review addition failed 
                // lets throw an error for this purpose 
                throw new AppError("Review addition failed due to some internal server error", StatusCodes.INTERNAL_ERROR_500);
            }
    
        }


        // now lets update the ratings value in the products table 
        const aggregateResponse = await prisma.reviews.aggregate({
            where : {product_id : productId}, 
            _avg: {rating : true}
        });

        const updatedAverageRating  = aggregateResponse._avg.rating? aggregateResponse._avg.rating : 0;

        // now lets update this in the product table itself 
        const updateProducResponse = await prisma.product.update({
            where : {id : productId},
            data : {
                ratings : updatedAverageRating
            }
        })

        // say everything went fine 
        return [reviewResponseToReturn, updateProducResponse]


    }


    static async deleteReviewService(userId : string|undefined, productId : string|undefined){
        /**
         * We need to do the following : 
         *      1. validate whether the userid, productids are corret or not
         *      2. delete the review from the reviews table given the userid and product id
         *      3. update the average rating in the products table
         * If at any point if any of the operation/action fails then we will simply throw
         * an error else at the end after everything is successfull we will return the 
         * updated product to the controller layer for this purpose
         */

        if(!userId || !productId){
            throw new AppError("Bad data.", StatusCodes.BAD_REQUEST_400);
        }

        await prisma.reviews.deleteMany({
            where : {user_id : userId, product_id : productId}
        });

        // now lets update the average rating of the product 
        const averageRatingAggregator = await prisma.reviews.aggregate({
            where : {user_id : userId, product_id : productId}, 
            _avg : {rating : true}
        });

        const updatedAverageRating = averageRatingAggregator._avg.rating ?? 0;

        // lets update the product table now for this purpose 
        const updatedProductResponse = await prisma.product.update({
            where : {id : productId}, 
            data : {ratings : updatedAverageRating}
        });

        // say everything went fine 
        return updatedProductResponse;

    }


    // service layer function to filter out the products using AI and user prompt
    static async fetchAIFilteredProductsService (userId : string | undefined, userPrompt : string|undefined) {
        if(!userId || !userPrompt){
            // the inputs required for this service layer function are not present 
            // or are not valid. hence lets throw an error 
            throw new AppError("One of the required field is empty.", StatusCodes.BAD_REQUEST_400);
        }

        // otherwise else use the AI and get back the response depending on the user prompt
        // we must define the output format of the AI reply and then we should validate
        // whether the output is as expected or not for this purpose. 
        const filterKeyword = (query : string) => {
            return query.toLowerCase()
                        .replace(/[^\w\s]/g, "")
                        .split(/\s+/)
                        .filter((word) => !stopWords.has(word));
        }
        

        const keyWords = filterKeyword(userPrompt);

        if(!keyWords){
            // this means that after filtering the user prompt there is nothing to search
            // this means that the user's prompt is very bad
            // hence lets throw an error to the client for such cases 
            throw new AppError("Please provide more better prompt.", StatusCodes.BAD_REQUEST_400);
        }

        // lets define the OR conditions 
        let orCondition = [];

        for (const keyword in keyWords){
            orCondition.push({name : {contains : keyword}})
            orCondition.push({description : {contains : keyword}})
            orCondition.push({category : {contains : keyword}})
        }

        // otherwise the prompt has passed the basic checks let's now filter the products with this 
        // i.e. lets do basic prisma filtering for this purpose 
        const listOfProductsToBePassed = await prisma.product.findMany({
            where : {
                // lets filter out those products who consists even a single element 
                OR:  orCondition
            }
        });

        if(!listOfProductsToBePassed){
            // no products found hence throw an error here itself 
            throw new AppError("No products found. Try changing the prompt.", StatusCodes.NOT_FOUND_404);
        }


        /**
         * Lets now pass this on to the AI based filtering to find out the products. 
         *      1. Basically we have find out the list of products on the basis of the 
         *          keywords only. But there could be some false positive. 
         *      2. AI will decrease that particular false positive. 
         * Lets do that 
         */

        // call the AI service here
        const finalListOfPrducts = await AIService.getAIRecommendationService(listOfProductsToBePassed, userPrompt);

        //otherwise we can pass this to the AI service layer itself
        // control reaches here meaning everything ran as expected. 
        // lets now return the AI recommended product to the controller layer 
        return finalListOfPrducts;

    }
}