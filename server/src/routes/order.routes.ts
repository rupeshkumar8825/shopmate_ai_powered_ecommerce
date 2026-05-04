// all routes related to the order entity is defined here 
import { Router } from "express";
import { authMiddleware } from "../middlware/auth.middleware";
import { OrderController } from "../controllers/order.controller";

const orderRoutes = Router();


orderRoutes.post("/new", authMiddleware, OrderController.placeNewOrderController);

export default orderRoutes;