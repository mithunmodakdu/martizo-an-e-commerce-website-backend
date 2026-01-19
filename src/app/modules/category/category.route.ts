import { Router } from "express";
import { CategoryControllers } from "./category.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategoryZodSchema, updateCategoryZodSchema } from "./category.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.get(
  "/",
  checkAuth(ERole.SUPER_ADMIN),
  CategoryControllers.getAllCategories
)

router.get(
  "/:id",
  checkAuth(ERole.SUPER_ADMIN),
  CategoryControllers.getCategoryById
)

router.post(
  "/create",
  checkAuth(ERole.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createCategoryZodSchema),
  CategoryControllers.createCategory
);

router.patch(
  "/:id",
  checkAuth(ERole.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(updateCategoryZodSchema),
  CategoryControllers.updateCategory
);

export const CategoryRoutes = router;
