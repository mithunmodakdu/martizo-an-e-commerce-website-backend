import { Router } from "express";
import { OTPControllers } from "./otp.controller";

const router = Router();

router.post("/send", OTPControllers.sendOTP);

export const OTPRoutes = router;