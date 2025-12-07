import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.post("/success", PaymentControllers.successPayment);

export const PaymentRoutes = router;