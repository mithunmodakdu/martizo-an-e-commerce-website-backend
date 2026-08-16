import { Schema, model } from "mongoose";
import { ILoyaltyAccount, ILoyaltyTransaction, TLoyaltyTransactionReason, TLoyaltyTransactionType } from "./loyalty.interface";

const loyaltyAccountSchema = new Schema<ILoyaltyAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
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
      index: true
    },
    loyaltyAccountId: {
      type: Schema.Types.ObjectId,
      ref: "LoyaltyAccount",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["EARN", "REDEEM", "EXPIRE", "REVERSE", "BONUS", "ADJUSTMENT"] satisfies TLoyaltyTransactionType[],
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "ORDER",
        "REDEMPTION",
        "SIGNUP",
        "FIRST_ORDER",
        "REFERRAL",
        "REVIEW",
        "BIRTHDAY",
        "CAMPAIGN",
        "ADMIN_ADJUSTMENT",
        "CORRECTION",
      ] satisfies TLoyaltyTransactionReason[],
      required: true,
    },
    points: {
      type: Number,
      required: true,
      validate: {
        validator: (v: number) => Number.isInteger(v) && v !== 0,
        message: "Points must be a non-zero integer."
      }
    },
    balanceAfter: {
      type: Number,
      required: true,
      min: 0
    },
    referenceId: {
      type: Schema.Types.ObjectId,
    },
    referenceType: {
      type: String,
      enum: ["ORDER", "REVIEW", "REFERRAL", "LOYALTY_TRANSACTION"],
    },
    reversalOf: {
      type: Schema.Types.ObjectId,
      ref: "LoyaltyTransaction"
    },
    isReversed: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      trim: true,
      maxLength: 300
    },
  },
  {
    timestamps: true,
  },
);

// Index for getting a user's transactions
loyaltyTransactionSchema.index({userId: 1, createdAt: -1});

// Unique index to prevent duplicate transactions
loyaltyTransactionSchema.index(
  {userId: 1, referenceId: 1, type: 1},
  {
    unique: true, 
    partialFilterExpression: {referenceId: {$exists: true}}
  }
)

export const LoyaltyTransaction = model<ILoyaltyTransaction>(
  "LoyaltyTransaction",
  loyaltyTransactionSchema,
);
