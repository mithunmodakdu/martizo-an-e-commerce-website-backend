import { Types } from "mongoose";

export type TLoyaltyTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export interface ITierThreshold {
  tier: TLoyaltyTier;
  minLifetimeEarned: number;
}

export interface ILoyaltyAccount {
  userId: Types.ObjectId;
  availablePoints: number;
  pendingPoints?: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  tier: TLoyaltyTier;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TLoyaltyTransactionType =
  | "EARN"
  | "REDEEM"
  | "EXPIRE"
  | "REVERSE"
  | "BONUS"
  | "ADJUSTMENT";

export type TLoyaltyTransactionReason =
  | "ORDER"
  | "REDEMPTION"
  | "SIGNUP"
  | "FIRST_ORDER"
  | "REFERRAL"
  | "REVIEW"
  | "BIRTHDAY"
  | "CAMPAIGN"
  | "ADMIN_ADJUSTMENT";


export interface ILoyaltyTransaction {
  userId: Types.ObjectId;
  loyaltyAccountId: Types.ObjectId;

  type: TLoyaltyTransactionType;
  reason: TLoyaltyTransactionReason;

  points: number;
  balanceAfter: number;

  referenceId?: Types.ObjectId;
  referenceType?: "ORDER" | "REVIEW" | "REFERRAL";

  reversalOf?: Types.ObjectId;
  isReversed?: boolean,

  description?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEarnPointsPayload {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  eligibleOrderAmount: number;
}

export interface IRedeemPointsPayload {
  userId: Types.ObjectId;
  orderId?: Types.ObjectId;
  points: number;
  description?: string;
}

export interface IBonusPointsPayload {
  userId: Types.ObjectId;
  points: number;
  reason: TLoyaltyTransactionReason;
  referenceId?: Types.ObjectId;
  referenceType?: "ORDER" | "REVIEW" | "REFERRAL";
  description?: string;
}

export interface IAdjustPointsPayload {
  userId: Types.ObjectId;
  points: number;  // signed: positive credits, negative debits
  reason: TLoyaltyTransactionReason;
  description?: string;
}


