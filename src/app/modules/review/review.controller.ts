import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ReviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { read } from "pdfkit";

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

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  await ReviewService.deleteReview(
    req.user.userId,
    req.user.role,
    req.params.reviewId as string,
  );

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "Review deleted successfully.",
    data: null,
  });
});

const voteReview = catchAsync(async (req: Request, res: Response) => {
  const { voteType } = req.body;
  const result = await ReviewService.voteReview(
    req.user.userId,
    req.params.reviewId as string,
    voteType,
  );

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "Vote recorded successfully",
    data: result,
  });
});

const moderateReview = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const result = await ReviewService.moderateReview(
    req.params.reviewId as string,
    status
  );

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: `Review status changed to ${status.toLowerCase()} successfully`,
    data: result,
  });
});

const addAdminReply = catchAsync(async (req: Request, res: Response) => {
  const { comment } = req.body;
  const result = await ReviewService.addAdminReply(
    req.user.userId,
    req.params.reviewId as string,
    comment
  );

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "Admin reply added to review successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  updateReview,
  deleteReview,
  voteReview,
  moderateReview,
  addAdminReply
};
