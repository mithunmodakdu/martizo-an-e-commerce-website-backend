import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { ProductControllers } from "./product.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { ProductCreationZodSchema, ProductUpdateZodSchema } from "./product.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.get("/", ProductControllers.getAllProducts);

router.get("/:slug", ProductControllers.getSingleProduct);

router.delete("/:id", checkAuth(ERole.SUPER_ADMIN, ERole.SUPER_ADMIN), ProductControllers.deleteProduct);

router.post(
  "/create",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),

  multerUpload.fields([
    {name: "file", maxCount: 1},
    {name: "files", maxCount: 6}
  ]),
  
  validateRequest(ProductCreationZodSchema),
  ProductControllers.createProduct
);

router.patch(
  "/update/:productId",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  multerUpload.array("files"),
  validateRequest(ProductUpdateZodSchema),
  ProductControllers.updateProduct
);

export const ProductRoutes = router;
