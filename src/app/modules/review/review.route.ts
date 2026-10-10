import { Router } from "express";
import { ReviewController } from "./review.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { addAdminReplyZodSchema, createReviewZodSchema, moderateReviewZodSchema, updateReviewZodSchema, voteReviewZodSchema } from "./review.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/create",
  checkAuth(...Object.values(ERole)),
  multerUpload.array("files", 5),
  validateRequest(createReviewZodSchema),
  ReviewController.createReview,
);

router.patch(
  "/:reviewId",
  checkAuth(...Object.values(ERole)),
  validateRequest(updateReviewZodSchema),
  ReviewController.updateReview
)

router.delete(
  "/:reviewId",
  checkAuth(...Object.values(ERole)),
  ReviewController.deleteReview
)

router.post(
  "/:reviewId/vote",
  checkAuth(...Object.values(ERole)),
  validateRequest(voteReviewZodSchema),
  ReviewController.voteReview
)

router.patch(
  "/:reviewId/moderate",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(moderateReviewZodSchema),
  ReviewController.moderateReview
)

router.patch(
  "/:reviewId/add-reply",
  checkAuth(ERole.SUPER_ADMIN, ERole.ADMIN),
  validateRequest(addAdminReplyZodSchema),
  ReviewController.addAdminReply
)

export const ReviewRoutes = router;
