import { Schema, model } from "mongoose";
import { ILoyaltyAccount, ILoyaltyTransaction } from "./loyalty.interface";

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

const loyaltyTransactionSchema = new Schema<ILoyaltyTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    loyaltyAccountId: {
      type: Schema.Types.ObjectId,
      ref: "LoyaltyAccount",
      required: true,
    },
    type: {
      type: String,
      enum: ["EARN", "REDEEM", "EXPIRE", "REVERSE", "BONUS", "ADJUSTMENT"],
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "ORDER",
        "SIGNUP",
        "FIRST_ORDER",
        "REFERRAL",
        "REVIEW",
        "BIRTHDAY",
        "CAMPAIGN",
        "ADMIN_ADJUSTMENT",
      ],
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 1,
    },
    balanceAfter: {
      type: Number,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
    },
    referenceType: {
      type: String,
      enum: ["ORDER", "REVIEW", "REFERRAL"],
    },
    reversalOf: {
      type: Schema.Types.ObjectId,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const LoyaltyTransaction = model<ILoyaltyTransaction>(
  "LoyaltyTransaction",
  loyaltyTransactionSchema,
);
