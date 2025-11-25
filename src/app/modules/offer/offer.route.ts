import { Router } from "express";
import { OfferControllers } from "./offer.controller";

const router = Router();

router.post("/create", OfferControllers.createOffer);

export const OfferRoutes = router;