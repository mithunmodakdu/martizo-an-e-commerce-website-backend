import { Types } from "mongoose";
import { EReviewStatus, TCreateReviewPayload } from "./review.interface";
import { Review } from "./review.model";
import AppError from "../../errorHelpers/AppError";
import httpStatusCodes from "http-status-codes";
import { Order } from "../order/order.model";

const checkVerifiedPurchase = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId,
): Promise<{isVerified: boolean; orderId?: Types.ObjectId}> => {
  const order = await Order.findOne({
    userId,
    status: "DELIVERED",
    "items.productId": productId,
  }).select("_id");

  return order
    ? { isVerified: true, orderId: order._id }
    : { isVerified: false };
};

const createReview = async (
  userId: Types.ObjectId,
  payload: TCreateReviewPayload,
) => {
  const existedReview = await Review.findOne({
    userId,
    productId: payload.productId,
  });

  if (existedReview) {
    throw new AppError(
      httpStatusCodes.CONFLICT,
      "You have already reviewed this product",
    );
  }

  const verifiedPurchase = await checkVerifiedPurchase(
    userId,
    payload.productId,
  );

  const review = await Review.create({
    ...payload,
    userId,
    orderId: verifiedPurchase.orderId,
    isVerifiedPurchase: verifiedPurchase.isVerified,
    status: EReviewStatus.PENDING,
    helpfulVote: [],
    unhelpfulVote: [],
  });
  
  return review;
};

export const ReviewService = {
  createReview,
};
