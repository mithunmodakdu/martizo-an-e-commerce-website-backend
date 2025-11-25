import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { ProductControllers } from "./product.controller";

const router = Router();

router.post("/create", checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN), ProductControllers.createProduct);

export const ProductRoutes = router;