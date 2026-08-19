import { Router } from "express";
import { ReviewController } from "./review.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createReviewZodSchema, updateReviewZodSchema } from "./review.validation";

const router = Router();

router.post(
  "/",
  checkAuth(...Object.values(ERole)),
  validateRequest(createReviewZodSchema),
  ReviewController.createReview,
);

router.patch(
  "/:reviewId",
  checkAuth(...Object.values(ERole)),
  validateRequest(updateReviewZodSchema),
  ReviewController.updateReview
)

export const ReviewRoutes = router;
