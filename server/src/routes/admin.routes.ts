import { Express, Router } from "express";
import { authMiddleware } from "../middlware/auth.middleware";
import { validateRole } from "../middlware/validate.role.middleware";

const adminRouter = Router();

adminRouter.get("/users", authMiddleware, validateRole("Admin"));

export default adminRouter;