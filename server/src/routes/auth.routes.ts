// this file will describe all the routes related to the authentication  
import { Express } from "express";
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

// lets define a new route
const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser)


export default router