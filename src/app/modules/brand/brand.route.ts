import { Router } from "express";
import { BrandControllers } from "./brand.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBrandZodSchema } from "./brand.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.get(
  "/",
  BrandControllers.getAllBrands
)

router.post(
  "/create",
  checkAuth(ERole.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createBrandZodSchema),
  BrandControllers.createBrand
);

export const BrandRoutes = router;
