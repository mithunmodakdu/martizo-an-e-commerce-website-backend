import { Router } from "express";
import { BrandControllers } from "./brand.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { CreateBrandZodSchema, UpdateBrandZodSchema } from "./brand.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.get(
  "/",
  BrandControllers.getAllBrands
)

router.patch(
  "/:id",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  multerUpload.single("file"),
  validateRequest(UpdateBrandZodSchema),
  BrandControllers.updateBrand
)

router.post(
  "/create",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  multerUpload.single("file"),
  validateRequest(CreateBrandZodSchema),
  BrandControllers.createBrand
);

export const BrandRoutes = router;
