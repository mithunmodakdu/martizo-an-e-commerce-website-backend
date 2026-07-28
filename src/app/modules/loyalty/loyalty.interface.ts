import { Document, Types } from "mongoose";

export type TLoyaltyReason =
  | 'ORDER_EARN'
  | 'ORDER_REDEEM'
  | 'ORDER_REFUND_REVERSAL'
  | 'SIGNUP_BONUS'
  | 'REFERRAL_BONUS'
  | 'MANUAL_ADJUSTMENT'
  | 'EXPIRY';

export interface ILoyaltyTransaction extends Document {
  userId: Types.ObjectId;
  orderId?: Types.ObjectId;
  points: number;          // positive = credit, negative = debit
  balanceAfter: number;    // snapshot for fast reads/debugging
  reason: TLoyaltyReason;
  expiresAt?: Date;        // for earned points that expire
  meta?: Record<string, unknown>;
  createdAt: Date;
}