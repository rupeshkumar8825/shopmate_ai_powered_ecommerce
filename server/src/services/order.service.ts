// service layer to handle all logic related to orders like placing an orders 
// and interacting with the database for this purpose. 

import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../config/prisma";
import { StatusCodes } from "../error/statusCodes";
import AppError from "../middlware/errorHandler";
import { avatarType, IorderItem, IOrderItemDB } from "../types/custom";
import { OrderStatus } from "../generated/prisma/enums";
import { PaymentsService } from "./payments.service";

export class OrderService {
    static async placeNewOrderService(userId : string|undefined, fullName : string|undefined, state : string|undefined, city : string|undefined, 
        country : string|undefined, address : string|undefined, pincode : string|undefined, phone : string|undefined, orderItems : IorderItem[]|undefined
    ){
        // lets first validate the inputs which are present here 
        if(!userId || !fullName || !state || !city || !country || !address
            || !pincode || !phone || !orderItems
        )
        {
            // we are missing some of the important fields. 
            // throw an error here which will be handled by the global error middleware
            throw new AppError("Required fields are either null or empty", StatusCodes.BAD_REQUEST_400);
        }

        // lets filter out all the productIds first from the orderItems
        const productIdList = orderItems.map(product => product.productId);

        const listOfAllProducts = await prisma.product.findMany({
            where : {id : {in : productIdList}}
        });

        if(!listOfAllProducts){
            // products are not present 
            throw new AppError("Product not found", StatusCodes.NOT_FOUND_404);
        }

        let totalPrice = 0;
        let orderItemToBeInsertedInDB : IOrderItemDB[] = [];

        orderItems.forEach((currOrderItem) => {
            let product = listOfAllProducts.find(currProduct => currProduct.id === currOrderItem.productId);
            if(!product){
                // this means that the product from the database is missing 
                throw new AppError(`Product with id : ${currOrderItem.productId}`, StatusCodes.NOT_FOUND_404);
            }

            if(currOrderItem.quantity > product.stock.toString()){
                throw new AppError(`Not enough stocks present for product ${product.id}`, StatusCodes.NOT_FOUND_404);
            }   
            const productPrice = Number(product.price.toString());
            // else calculate the total price 
            totalPrice = totalPrice + ((productPrice) * (parseInt(currOrderItem.quantity)));
            const productImage = product.images as avatarType[];

            orderItemToBeInsertedInDB.push({
                product_id : product.id, 
                quantity : Number(currOrderItem.quantity),
                price : Number(product.price), 
                image : productImage[0]? productImage[0].url : "", 
                title : product.name
            });
        });

        const taxPrice = 0.008;
        const shippingPrice = 2;
        totalPrice = totalPrice + totalPrice * taxPrice * shippingPrice;
        // now lets create the order 
        const newOrderResponse = await prisma.order.create({
            data : {
                buyer_id : userId, 
                total_price : totalPrice, 
                tax_price : taxPrice, 
                shipping_price : 2, 
                order_status : OrderStatus.Processing, 
            }
        });

        if(!newOrderResponse){
            // some issue occurred while creating a new order 
            throw new AppError("Something went wrong while creating the new order", StatusCodes.INTERNAL_ERROR_500);
        }

        // lets now update the OrderItem database table with these new orders for this purpose
        for(let currOrderItemForDb of orderItemToBeInsertedInDB){
            const createNewOrderItemResponse = await prisma.orderItem.create({
                data : {
                    order_id : newOrderResponse.id, 
                    product_id : currOrderItemForDb.product_id, 
                    quantity : currOrderItemForDb.quantity, 
                    price : currOrderItemForDb.price, 
                    image : currOrderItemForDb.image, 
                    title : currOrderItemForDb.title, 
                }
            })

            if(!createNewOrderItemResponse){
                // something went wrong while creating the entry in the database
                // lets return an error for this purpose
                throw new AppError("Something went wrong while adding a new entry in OrderItem table", StatusCodes.INTERNAL_ERROR_500);
            }
        }

        // now lets add the shipping info into the shipping info table for this purpose
        const addShippingInfoResponse = await prisma.shippingInfo.create({
            data : {
                order_id : newOrderResponse.id, 
                full_name : fullName, 
                state : state, 
                city : city, 
                country : country, 
                address : address, 
                pincode : pincode, 
                phone : phone
            }
        });
        if(!addShippingInfoResponse){
            // something went wrong again
            throw new AppError("Something went wrong while inserting into the shipping details table", StatusCodes.INTERNAL_ERROR_500);
        }

        // now we need to generate payment intent for this purpose 
        const generatePaymentIntentServiceResponse = await PaymentsService.createPaymentIntentService(newOrderResponse.id, totalPrice);
        if(!generatePaymentIntentServiceResponse.success){
            // this means that something bad happened
            throw new AppError("Internal error while generating the payment intent", StatusCodes.INTERNAL_ERROR_500);
        }

        // say everything went fine 
        return [newOrderResponse, generatePaymentIntentServiceResponse];

    }


    /**
     * Function to fetch the details of a single order given the orderId. 
     * Following details are fetched and then send to the controller
     *      1. Basic order details : - all the fields of the order table 
     *      2. All order items : - given an order there could be multiple order items 
     *          this would be an array of orderitems details 
     *      3. Shipping Info : - each of the order will have a unique shipping info that 
     *          we need to fetch. 
     * @param orderId unique id of the order
     * @param userId unique id of the user. This we will get from the request object itself
     */
    static async fetchSingleOrderService(orderId : string|undefined, userId : string|undefined) {
        // lets validate the inputs first 
        if(!orderId || !userId){
            throw new AppError("One of the required input is either invalid , empty or null", StatusCodes.BAD_REQUEST_400);
        }
        
        const orderDetailsResponse = await prisma.order.findUnique({
            where : {id : orderId}, 
            include : {
                orderItemList : true, 
                shippingInfoList : true, 
            }
        });


        if(!orderDetailsResponse){
            // it seems no order is found
            // lets throw an error for the same 
            throw new AppError("Order not found", StatusCodes.NOT_FOUND_404);
        }

        // say everything went fine 
        return orderDetailsResponse;
            

    }


    static async fetchMyOrderDetailsService (userId : string|undefined){
        // validation of the input 
        if(!userId){
            // userid not valid. return 
            throw new AppError("UserId is invalid.", StatusCodes.BAD_REQUEST_400);
        }

        // else check whether user actually exists with this particular id or not 
        const userDetailsResponse = await prisma.user.findUnique({
            where : {id : userId}
        });
        if(!userDetailsResponse){
            // user not found. lets throw an error here  
            throw new AppError("User not found", StatusCodes.NOT_FOUND_404);
        }

        // now we have validated that the user is found. 
        // now lets find the details of all theo orders for this user 
        const allOrderDetailsResponse = await prisma.order.findMany({
            where : {buyer_id : userId}, 
            include: {
                orderItemList : true,
                shippingInfoList : true
            }
        });

        if(allOrderDetailsResponse){
            // no order found for this user 
            throw new AppError("No orders found", StatusCodes.NOT_FOUND_404);
        }

        // else lets return this to the controller layer 
        // say everything went fine 
        return allOrderDetailsResponse;
    }
}