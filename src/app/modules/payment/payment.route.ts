import { Router } from "express";
import { PaymentControllers } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";

const router = Router();

router.post("/success", PaymentControllers.successPayment);
router.post("/fail", PaymentControllers.failPayment);
router.post("/cancel", PaymentControllers.cancelPayment);
router.post("/init/:orderId", PaymentControllers.initPayment);
router.get("/invoice/:paymentId", checkAuth(...Object.values(ERole)), PaymentControllers.getInvoiceDownloadUrl);

export const PaymentRoutes = router;