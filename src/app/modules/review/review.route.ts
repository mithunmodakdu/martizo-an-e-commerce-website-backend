import { Router } from "express";
import { ReviewController } from "./review.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createReviewZodSchema } from "./review.validation";

const router = Router();

router.post("/", checkAuth(...Object.values(ERole)), validateRequest(createReviewZodSchema), ReviewController.createReview)

export const ReviewRoutes = router;