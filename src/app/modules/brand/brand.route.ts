import { Router } from "express";
import { BrandControllers } from "./brand.controller";

const router = Router();

router.post("/create", BrandControllers.createBrand);

export const BrandRoutes = router;