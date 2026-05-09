// all routes related to the order entity is defined here 
import { Router } from "express";
import { authMiddleware } from "../middlware/auth.middleware";
import { OrderController } from "../controllers/order.controller";
import { validateRole } from "../middlware/validate.role.middleware";

const orderRoutes = Router();


orderRoutes.post("/new", authMiddleware, OrderController.placeNewOrderController);
orderRoutes.get("/:orderId", authMiddleware, OrderController.fetchSingleOrderController);
orderRoutes.get("/user/all", authMiddleware, OrderController.fetchMyOrderDetailsController);
orderRoutes.get("/admin/getall", authMiddleware, validateRole("Admin"), OrderController.fetchAllOrdersController);

export default orderRoutes;