import express from "express";
import { LoyaltyController } from "./loyalty.controller";

const router = express.Router();

router.post(
  "/earn/:orderId",
  LoyaltyController.earnPoints
);

export const LoyaltyRoutes = router;