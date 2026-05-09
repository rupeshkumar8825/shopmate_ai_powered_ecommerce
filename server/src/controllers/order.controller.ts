import { Request, Response } from "express";
import { StatusCodes } from "../error/statusCodes";
import { IorderItem } from "../types/custom";
import { OrderService } from "../services/order.service";

// controller layer code to handle everything related to the orders 
export class OrderController {
    
    /**
     * 
     * @param request 
     * @param response 
     * @returns 
     */
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


    /**
     * 
     * @param request 
     * @param response 
     * @returns 
     */
    static async fetchSingleOrderController (request : Request, response : Response) {
        const orderId : string|undefined = request.params.orderId as string;
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




    /**
     * 
     * @param request 
     * @param response 
     * @returns 
     */
    static async fetchMyOrderDetailsController (request : Request, response : Response) {
        const userId : string|undefined = request.userId;

        // call the service layer function here 
        const allOrderDetailsResponse = await OrderService.fetchMyOrderDetailsService(userId);

        // if the control reaches here this means that the all the order details of 
        // of all the orders of a given order is fetched 
        // say everything went fine 
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "Order details found.",
            orderItems : allOrderDetailsResponse
        });

    }


    /**
     * 
     * @param request 
     * @param response 
     */
    static async fetchAllOrdersController (request : Request, response : Response) {
        // call the service layer function 
        const orderDetailsResponse = await OrderService.fetchAllOrdersService();
        // if the control reaches then this means that the api request or the call to 
        // the service layer function is successfull and its done
        // say everything went fine
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "Orders fetched successfully", 
            orderDetails : orderDetailsResponse
        });
    }

    static async updateOrderStatusController (request : Request, response : Response) {
        const orderId : string|undefined = request.params.orderId as string;
        const updatedOrderStatus : string|undefined = request.body.orderId; 

        // call the service layer function 
        const updatedOrderDetailsResponse = await OrderService.updateOrderStatusService(orderId, updatedOrderStatus);

        // say everything went fine
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true,
            message : "Updated the order status successfully", 
            orderDetails : updatedOrderDetailsResponse
        });
    }


    static async deleteOrderController (request : Request, response : Response) {
        const orderId : string|undefined = request.params.orderId as string;

        // call the service layer function 
        const deleteOrderResponse = await OrderService.deleteOrderService(orderId);
        // if control reaches here this means that the service layer function executed
        // successfully. 
        // hence lets say everything went fine 
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true, 
            message : "Order deleted successfully", 
            deleteOrderDetails : deleteOrderResponse
        });
    }
}