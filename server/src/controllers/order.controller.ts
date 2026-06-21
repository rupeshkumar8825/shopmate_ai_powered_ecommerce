import { Request, Response } from "express";
import { StatusCodes } from "../error/statusCodes";
import { ProductToQuantity } from "../types/custom";
import { OrderService } from "../services/order.service";

// controller layer code to handle everything related to the orders 
export class OrderController {
    
    /**
     * Controller to place a new order for the currently logged in user.
     * Reads the shipping details and the list of order items from the request body,
     * delegates the actual order creation to the service layer and returns the
     * created order along with the generated payment intent details.
     * @param request express request object (expects userId on the request and the
     *      shipping/order details in the body)
     * @param response express response object
     * @returns json response containing the newly created order and payment details
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
        const orderItems : ProductToQuantity[] | undefined = request.body.orderItems;

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
     * Controller to fetch the details of a single order.
     * Reads the orderId from the route params and the userId from the request,
     * then asks the service layer for the order (along with its items and shipping info).
     * @param request express request object (expects orderId in params and userId on the request)
     * @param response express response object
     * @returns json response containing the details of the requested order
     */
    static async fetchSingleOrderController (request : Request, response : Response) {
        // orderId comes from the route params and userId is attached to the request by the auth middleware
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
     * Controller to fetch all the orders that belong to the currently logged in user.
     * The userId is read from the request (set by the auth middleware) and passed to
     * the service layer which returns every order placed by that user.
     * @param request express request object (expects userId on the request)
     * @param response express response object
     * @returns json response containing the list of the user's orders
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
     * Controller (admin facing) to fetch every order present in the system.
     * No input is needed from the request; it simply delegates to the service layer
     * and returns all the orders along with their items and shipping info.
     * @param request express request object
     * @param response express response object
     * @returns json response containing all the orders
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

    /**
     * Controller (admin facing) to update the status of an existing order
     * (for example moving it from "Processing" to "Shipped").
     * @param request express request object (expects orderId in params and orderStatus in the body)
     * @param response express response object
     * @returns json response containing the updated order details
     */
    static async updateOrderStatusController (request : Request, response : Response) {
        // orderId identifies which order to update and orderStatus is the new status to set
        const orderId : string|undefined = request.params.orderId as string;
        const updatedOrderStatus : string|undefined = request.body.orderStatus;

        // call the service layer function 
        const updatedOrderDetailsResponse = await OrderService.updateOrderStatusService(orderId, updatedOrderStatus);

        // say everything went fine
        return response.status(StatusCodes.SUCCESS_200).json({
            success : true,
            message : "Updated the order status successfully", 
            orderDetails : updatedOrderDetailsResponse
        });
    }


    /**
     * Controller (admin facing) to delete an order given its id.
     * @param request express request object (expects orderId in params)
     * @param response express response object
     * @returns json response confirming the deletion
     */
    static async deleteOrderController (request : Request, response : Response) {
        // orderId identifies which order needs to be deleted
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