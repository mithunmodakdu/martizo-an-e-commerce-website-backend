import { Schema } from "mongoose";
import { IAdminReply, IReviewImage } from "./review.interface";

const reviewImageSchema = new Schema<IReviewImage>(
  {
    url: {type: String, required: true},
    publicId: {type: String}
  },
  {
    _id: false
  }
);


const adminReplySchema = new Schema<IAdminReply>(
  {
    comment: {type: String, required: true, trim: true, maxLength: 1000},
    repliedBy: {type: Schema.Types.ObjectId, ref: "User", required: true},
    repliedAt: {type: Date, required: true, default: Date.now}
  },
  {
    _id: false
  }
)




