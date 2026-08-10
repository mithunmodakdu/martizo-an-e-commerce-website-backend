import { Schema, model } from "mongoose";
import { ILoyaltyAccount } from "./loyalty.interface";

const loyaltyAccountSchema = new Schema<ILoyaltyAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    availablePoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    pendingPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    lifetimeEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    lifetimeRedeemed: {
      type: Number,
      default: 0,
      min: 0,
    },

    tier: {
      type: String,
      enum: ["BRONZE", "SILVER", "GOLD", "PLATINUM"],
      default: "BRONZE",
    },
  },
  {
    timestamps: true,
  },
);

export const LoyaltyAccount = model<ILoyaltyAccount>(
  "LoyaltyAccount",
  loyaltyAccountSchema,
);

