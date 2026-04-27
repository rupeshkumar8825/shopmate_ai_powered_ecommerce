import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authMiddleware } from "../middlware/auth.middleware";
import { validateRole } from "../middlware/validate.role.middleware";

const productRoutes = Router();

// lets define the outline of all the possible routes
productRoutes.post("/admin/create", authMiddleware, validateRole("Admin"), ProductController.createProductController)
productRoutes.get("/", ProductController.fetchAllProductsController)
// say everything went fine 
export default productRoutes
