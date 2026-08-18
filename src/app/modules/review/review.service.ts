import { Types } from "mongoose";
import { TCreateReviewPayload } from "./review.interface";

const createReview = async(userId: Types.ObjectId, payload: TCreateReviewPayload) => {
  console.log(userId)
  console.log(payload)
}

export const ReviewService = {
  createReview
}