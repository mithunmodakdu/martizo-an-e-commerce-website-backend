import { Router } from "express";
import { StatsControllers } from "./stats.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";

const router = Router();

router.get("/users", checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),  StatsControllers.getUsersStats);
router.get("/products", StatsControllers.getProductsStats);
router.get("/orders", StatsControllers.getOrdersStats);
router.get("/payments", StatsControllers.getPaymentsStats);

export const StatsRoutes = router;