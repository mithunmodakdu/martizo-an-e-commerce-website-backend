import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ReviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req.user.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatusCodes.CREATED,
    success: true,
    message: "Your Review submitted and is pending for approval",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.updateReview(
    req.user.userId,
    req.params.reviewId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatusCodes.CREATED,
    success: true,
    message: "Your Review updated and resubmitted for approval",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  updateReview
};
