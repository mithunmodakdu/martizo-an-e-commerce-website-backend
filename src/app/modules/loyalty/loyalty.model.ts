import { model, Schema } from "mongoose";
import { ILoyaltyTransaction } from "./loyalty.interface";

const loyaltyTransactionSchema = new Schema<ILoyaltyTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    points: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reason: {
      type: String,
      enum: ['ORDER_EARN', 'ORDER_REDEEM', 'ORDER_REFUND_REVERSAL', 'SIGNUP_BONUS', 'REFERRAL_BONUS', 'MANUAL_ADJUSTMENT', 'EXPIRY'],
      required: true,
    },
    expiresAt: { type: Date, index: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

loyaltyTransactionSchema.index({ userId: 1, createdAt: -1 });

export const LoyaltyTransaction = model<ILoyaltyTransaction>(
  'LoyaltyTransaction',
  loyaltyTransactionSchema
);