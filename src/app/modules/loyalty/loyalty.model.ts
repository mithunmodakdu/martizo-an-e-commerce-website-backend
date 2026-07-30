import { Schema, model } from "mongoose";
import { ILoyaltyAccountDocument, ILoyaltyTransactionDocument, LoyaltyTransactionType } from "./loyalty.interface";

// :::: Loyalty Account :::: 
const loyaltyAccountSchema = new Schema<ILoyaltyAccountDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalPoints: { type: Number, default: 0, min: 0 },
    lifetimeEarned: { type: Number, default: 0, min: 0 },
    lifetimeRedeemed: { type: Number, default: 0, min: 0 },
    lifetimeExpired: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export const LoyaltyAccount = model<ILoyaltyAccountDocument>(
  'LoyaltyAccount',
  loyaltyAccountSchema,
);


// :::: Loyalty Transaction :::: 
const loyaltyTransactionSchema = new Schema<ILoyaltyTransactionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: Object.values(LoyaltyTransactionType), required: true },
    points: { type: Number, required: true, min: 0 },
    remainingPoints: { type: Number, default: 0, min: 0 },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    description: { type: String, required: true, trim: true },
    expiresAt: { type: Date },
    isExpired: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

// Speeds up the FIFO scan used when redeeming or expiring points.
loyaltyTransactionSchema.index({ userId: 1, type: 1, remainingPoints: 1, expiresAt: 1 });

export const LoyaltyTransaction = model<ILoyaltyTransactionDocument>(
  'LoyaltyTransaction',
  loyaltyTransactionSchema,
);


