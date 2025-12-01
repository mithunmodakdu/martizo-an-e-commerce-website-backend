import { Router } from "express";
import { CartControllers } from "./cart.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";

const router = Router();

router.post("/add", checkAuth(...Object.values(ERole)), CartControllers.addToCart);

export const CartRoutes = router;