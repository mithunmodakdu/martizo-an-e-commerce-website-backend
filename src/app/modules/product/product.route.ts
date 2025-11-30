import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { ProductControllers } from "./product.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { ProductCreationZodSchema } from "./product.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(ProductCreationZodSchema),
  ProductControllers.createProduct
);

router.get("/", ProductControllers.getAllProducts);

router.get("/:slug", ProductControllers.getSingleProduct);

export const ProductRoutes = router;
