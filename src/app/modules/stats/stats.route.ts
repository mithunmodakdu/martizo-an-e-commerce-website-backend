import { Router } from "express";
import { StatsControllers } from "./stats.controller";

const router = Router();

router.get("/users", StatsControllers.getUsersStats);
router.get("/products", StatsControllers.getProductsStats);
router.get("/orders", StatsControllers.getOrdersStats);
router.get("/payments", StatsControllers.getPaymentsStats);

export const StatsRoutes = router;