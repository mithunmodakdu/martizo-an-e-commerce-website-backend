import { Router } from "express";
import { ReviewController } from "./review.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";

const router = Router();

router.post("/", checkAuth(...Object.values(ERole)), ReviewController.createReview)

export const ReviewRoutes = router;