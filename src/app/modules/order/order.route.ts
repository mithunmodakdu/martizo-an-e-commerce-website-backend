import { Router } from "express";
import { OrderControllers } from "./order.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { CreateOrderZodSchema, UpdateOrderZodSchema } from "./order.validation";

const router = Router();

router.get(
  "/transaction/:transactionId",
  checkAuth(...Object.values(ERole)),
  OrderControllers.getOrderByTransactionId,
);

router.get(
  "/get-order/:orderNo",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  OrderControllers.getOrderByOrderNo
);

router.get(
  "/:id",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  OrderControllers.getOrderById
);
router.get(
  "/",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  OrderControllers.getOrders,
);
router.patch(
  "/update/:id",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(UpdateOrderZodSchema),
  OrderControllers.updateOrderById,
);
router.post(
  "/create",
  checkAuth(...Object.values(ERole)),
  validateRequest(CreateOrderZodSchema),
  OrderControllers.createOrder,
);


export const OrderRoutes = router;
