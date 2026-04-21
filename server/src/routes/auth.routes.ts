// this file will describe all the routes related to the authentication  
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlware/auth.middleware";

// lets define a new route
const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/me", authMiddleware, AuthController.getUserDetails);
router.post("/logout", authMiddleware, AuthController.logoutUser);


export default router