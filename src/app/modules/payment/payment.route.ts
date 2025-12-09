import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.post("/success", PaymentControllers.successPayment);

router.post("/fail", PaymentControllers.failPayment);

export const PaymentRoutes = router;