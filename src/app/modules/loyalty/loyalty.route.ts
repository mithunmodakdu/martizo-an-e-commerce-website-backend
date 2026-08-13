import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { LoyaltyController } from "./loyalty.controller";

const router = Router();

router.get(
  "/my-account",
  checkAuth(...Object.values(ERole)),
  LoyaltyController.getLoyaltyAccountByUserId
);

router.post(
  "/redeem-points",
  checkAuth(...Object.values(ERole)),
  LoyaltyController.redeemLoyaltyPoints
)

export const LoyaltyRoutes = router;
