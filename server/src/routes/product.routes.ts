import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const productRouter = Router();

// lets define the outline of all the possible routes
productRouter.get("/:id", ProductController.getProduct);
productRouter.delete("/:id", ProductController.deleteProduct);
productRouter.get("/:userId", ProductController.getListOfAllProductsGivenUser)

// say everything went fine 
export default productRouter
