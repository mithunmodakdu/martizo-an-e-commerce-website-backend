import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.post("/success", PaymentControllers.successPayment);
router.post("/fail", PaymentControllers.failPayment);
router.post("/cancel", PaymentControllers.cancelPayment);
router.post("/init/:orderId", PaymentControllers.initPayment);

export const PaymentRoutes = router;