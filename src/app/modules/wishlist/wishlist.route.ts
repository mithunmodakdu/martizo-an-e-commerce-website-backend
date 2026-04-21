import { Router } from "express";
import { WishlistControllers } from "./wishlist.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";

const router = Router();

router.patch(
  "/:productId",
  checkAuth(...Object.values(ERole)),
  WishlistControllers.removeFromWishlist,
);
router.get(
  "/",
  checkAuth(...Object.values(ERole)),
  WishlistControllers.getWishlist,
);
router.post(
  "/",
  checkAuth(...Object.values(ERole)),
  WishlistControllers.addToWishlist,
);

export const WishlistRoutes = router;
