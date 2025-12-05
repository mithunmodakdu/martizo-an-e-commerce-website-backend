import { Router } from "express";
import { OrderControllers } from "./order.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { CreateOrderZodSchema } from "./order.validation";

const router = Router();

router.post("/create", checkAuth(...Object.values(ERole)), validateRequest(CreateOrderZodSchema), OrderControllers.createOrder);

export const OrderRoutes = router;