import { Types } from "mongoose";
import { EReviewStatus, EVoteType, TCreateReviewPayload, TUpdateReviewPayload } from "./review.interface";
import { Review } from "./review.model";
import AppError from "../../errorHelpers/AppError";
import httpStatusCodes from "http-status-codes";
import { Order } from "../order/order.model";
import { ERole } from "../user/user.interface";

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

const updateReview = async(userId: string, reviewId: string, payload: TUpdateReviewPayload) => {
  const existedReview = await Review.findById(reviewId);
  
  if(!existedReview){
    throw new AppError(httpStatusCodes.NOT_FOUND, "Review Not Found.")
  }

  if(existedReview.userId.toString() !== userId){
    throw new AppError(httpStatusCodes.FORBIDDEN, "You can only edit your own review.")
  }

  Object.assign(existedReview, payload);

  existedReview.status = EReviewStatus.PENDING;

  await existedReview.save();

  return existedReview;
}

const deleteReview = async(userId: string, userRole: string, reviewId: string) => {
  
  const existedReview = await Review.findById(reviewId);
  
  if(!existedReview){
    throw new AppError(httpStatusCodes.NOT_FOUND, "Review Not Found")
  }

  const isReviewOwner = existedReview.userId.toString() === userId;
  const isSuperAdmin = ERole.SUPER_ADMIN === userRole;
  const isAdmin = ERole.ADMIN === userRole;

  if(!isReviewOwner && !isSuperAdmin && !isAdmin){
    throw new AppError(httpStatusCodes.FORBIDDEN, 'You are not allowed to delete this review')
  }

  await Review.findOneAndDelete({_id: reviewId});

  return null;
}

const voteReview = async(userId: string, reviewId: string, voteType: EVoteType) => {
  const userObjectId = new Types.ObjectId(userId);
  const existedReview = await Review.findById(reviewId);
  
  if(!existedReview){
    throw new AppError(httpStatusCodes.NOT_FOUND, "Review Not Found");
  }

  const hasHelpfulVote = existedReview.helpfulVote.some(id => id.equals(userObjectId));
  const hasUnhelpfulVote = existedReview.unhelpfulVote.some(id => id.equals(userObjectId));

  existedReview.helpfulVote = existedReview.helpfulVote.filter(id => !id.equals(userObjectId));
  existedReview.unhelpfulVote = existedReview.unhelpfulVote.filter(id => !id.equals(userObjectId));

  if(voteType === EVoteType.HELPFUL && !hasHelpfulVote){
    existedReview.helpfulVote.push(userObjectId);
  }else if(voteType === EVoteType.UNHELPFUL && !hasUnhelpfulVote){
    existedReview.unhelpfulVote.push(userObjectId);
  }

  await existedReview.save();
  
  return existedReview;

}


export const ReviewService = {
  createReview,
  updateReview,
  deleteReview,
  voteReview
};
