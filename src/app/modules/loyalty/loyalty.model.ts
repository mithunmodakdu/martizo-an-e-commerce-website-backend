import { Schema, model } from "mongoose";
import { ILoyaltyAccountDocument } from "./loyalty.interface";

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
