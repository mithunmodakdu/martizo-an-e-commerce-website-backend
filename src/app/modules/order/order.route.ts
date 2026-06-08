import { Router } from "express";
import { OrderControllers } from "./order.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { CreateOrderZodSchema } from "./order.validation";

const router = Router();

router.get("/:transactionId", checkAuth(...Object.values(ERole)), OrderControllers.getOrderByTransactionId);
router.patch("/update/:id", checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN), OrderControllers.updateOrderById);
router.post("/create", checkAuth(...Object.values(ERole)), validateRequest(CreateOrderZodSchema), OrderControllers.createOrder);
router.get("/", checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN), OrderControllers.getOrders);

export const OrderRoutes = router;