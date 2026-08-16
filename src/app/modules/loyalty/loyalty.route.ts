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
);

router.post(
  "/bonus-points",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  LoyaltyController.bonusLoyaltyPoints
)

router.post(
  "/adjust-points",
  checkAuth(ERole.ADMIN, ERole.SUPER_ADMIN),
  LoyaltyController.adjustLoyaltyPoints
)

export const LoyaltyRoutes = router;
