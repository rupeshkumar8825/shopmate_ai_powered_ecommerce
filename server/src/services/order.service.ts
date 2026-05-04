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
}