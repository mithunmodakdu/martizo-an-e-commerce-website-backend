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

export const LoyaltyRoutes = router;
