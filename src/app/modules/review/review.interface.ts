import { Model, Types } from "mongoose";

export enum EReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum EVoteType {
  HELPFUL = 'HELPFUL',
  UNHELPFUL = 'UNHELPFUL'
}

export interface IReviewImage {
  url: string;
  publicId?: string;
}

export interface IAdminReply {
  comment: string;
  repliedBy: Types.ObjectId;
  repliedAt: Date;
}

export interface IReview {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  orderId?: Types.ObjectId;

  rating: number;
  title?: string;
  comment?: string;

  isVerifiedPurchase: boolean;

  images?: IReviewImage[];
  status: EReviewStatus;
  helpfulVote: Types.ObjectId[];
  unhelpfulVote: Types.ObjectId[];
  adminReply: IAdminReply;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReviewModel extends Model<IReview> {
  calculateAverageRatings(productId: Types.ObjectId) : Promise<void>
}