import { Request, Response } from "express";
import { StatusCodes } from "../error/statusCodes";
import { IorderItem } from "../types/custom";
import { OrderService } from "../services/order.service";

// controller layer code to handle everything related to the orders 
export class OrderController {
    
    static async placeNewOrderController (request : Request, response : Response) {
        // lets first get all the details about the order and about the user who is 
        // placing an order 
        const userId : string|undefined = request.userId;
        const fullName : string | undefined = request.body.fullName;
        const state : string | undefined = request.body.state;
        const city : string | undefined = request.body.city;
        const country : string | undefined = request.body.country;
        const address : string | undefined = request.body.address;
        const pincode : string | undefined = request.body.pincode;
        const phone : string | undefined = request.body.phone;
        if(!Array.isArray(request.body.orderItems)) {
            // this is not array hence lets return from here 
            return response.status(StatusCodes.NOT_FOUND_404).json({
                success : false, 
                message : "Orderitems not found"
            });
        }
        // else lets get the orderItems 
        const orderItems : IorderItem[] | undefined = request.body.orderItems;

        // lets call the service layer function 
        const [newOrderServiceResponse, generatePaymentIntentResponse] = await OrderService.placeNewOrderService(userId, fullName, state, city, country, address, pincode, phone, orderItems);

        // if control reaches here then this means that the order is placed already
        // say everything went fine 
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "Order Successfully placed", 
            order : newOrderServiceResponse, 
            paymentDetails : generatePaymentIntentResponse
        });

    }


    // controller function to fetch the details about a given controller
    static async fetchSingleOrderController (request : Request, response : Response) {
        const orderId : string|undefined = request.body.orderId;
        const userId : string|undefined = request.userId;

        // lets call the service layer function here 
        const orderDetailsServiceResponse = await OrderService.fetchSingleOrderService(orderId, userId);

        // if control reaches then it means that 
        // say everything went fine 
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "Order details found", 
            orderDetails : orderDetailsServiceResponse
        });
    }
}