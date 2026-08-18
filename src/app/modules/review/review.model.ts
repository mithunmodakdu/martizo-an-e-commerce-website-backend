import { model, Schema } from "mongoose";
import {
  EReviewStatus,
  IAdminReply,
  IReview,
  IReviewImage,
  IReviewModel,
} from "./review.interface";

const reviewImageSchema = new Schema<IReviewImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
  },
  {
    _id: false,
  },
);

const adminReplySchema = new Schema<IAdminReply>(
  {
    comment: { type: String, required: true, trim: true, maxLength: 1000 },
    repliedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    repliedAt: { type: Date, required: true, default: Date.now },
  },
  {
    _id: false,
  },
);

const reviewSchema = new Schema<IReview, IReviewModel>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxLength: 120 },
    comment: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 2000,
    },
    images: { type: [reviewImageSchema], default: [] },
    isVerifiedPurchase: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(EReviewStatus),
      default: EReviewStatus.PENDING,
      index: true,
    },
    helpfulVote: {type: [Schema.Types.ObjectId], ref: "User", default: []},
    unhelpfulVote: {type: [Schema.Types.ObjectId], ref: "User", default: []},
    adminReply: {type: adminReplySchema}
  },
  {
    timestamps: true,
  },
);

export const Review = model<IReview, IReviewModel>("Review", reviewSchema);
