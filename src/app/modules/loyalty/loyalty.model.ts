import { Schema, model } from "mongoose";
import { ILoyalty } from "./loyalty.interface";

const loyaltySchema = new Schema<ILoyalty>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    type: {
      type: String,
      enum: ["EARN", "REDEEM", "REFUND", "BONUS", "EXPIRE"],
      required: true,
    },

    points: {
      type: Number,
      required: true,
    },

    description: String,

    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Loyalty = model<ILoyalty>(
  "Loyalty",
  loyaltySchema
);