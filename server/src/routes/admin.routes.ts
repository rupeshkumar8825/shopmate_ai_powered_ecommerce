import { Express, Router } from "express";
import { authMiddleware } from "../middlware/auth.middleware";
import { validateRole } from "../middlware/validate.role.middleware";
import { AdminController } from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.get("/users", authMiddleware, validateRole("Admin"), AdminController.getAllUsersController);
adminRouter.delete("/user", authMiddleware, validateRole("Admin"), AdminController.deleteUserController);

export default adminRouter;