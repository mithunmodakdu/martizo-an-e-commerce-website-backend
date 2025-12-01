import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { OfferRoutes } from "../modules/offer/offer.route";
import { ProductRoutes } from "../modules/product/product.route";
import { CartRoutes } from "../modules/cart/cart.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes
  },
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/categories",
    route: CategoryRoutes
  },
  {
    path: "/brands",
    route: BrandRoutes
  },
  {
    path: "/offers",
    route: OfferRoutes
  },
  {
    path: "/products",
    route: ProductRoutes
  },
  {
    path: "/cart",
    route: CartRoutes
  }
];

moduleRoutes.forEach((moduleRoute) => {
  router.use(moduleRoute.path, moduleRoute.route);
})