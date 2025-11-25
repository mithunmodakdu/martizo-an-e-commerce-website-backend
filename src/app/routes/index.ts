import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { OfferRoutes } from "../modules/offer/offer.route";

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
  }
];

moduleRoutes.forEach((moduleRoute) => {
  router.use(moduleRoute.path, moduleRoute.route);
})