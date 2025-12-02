import { Router } from "express";
import { CartControllers } from "./cart.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";

const router = Router();

router.post(
  "/add",
  checkAuth(...Object.values(ERole)),
  CartControllers.addToCart
);
router.get(
  "/",
  checkAuth(...Object.values(ERole)),
  CartControllers.getUserCart
);
router.patch(
  "/update",
  checkAuth(...Object.values(ERole)),
  CartControllers.updateCartItem
);
router.delete(
  "/remove/:productId",
  checkAuth(...Object.values(ERole)),
  CartControllers.removeCartItem
);

export const CartRoutes = router;
