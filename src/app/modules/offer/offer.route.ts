import { Router } from "express";
import { OfferControllers } from "./offer.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createOfferZodSchema } from "./offer.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(ERole.SUPER_ADMIN),
  validateRequest(createOfferZodSchema),
  OfferControllers.createOffer
);

export const OfferRoutes = router;
