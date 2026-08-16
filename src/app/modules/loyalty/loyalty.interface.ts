import { Types } from "mongoose";

export type TLoyaltyTier = "PLATINUM" | "GOLD" | "SILVER" | "BRONZE";

export interface ITierThreshold {
  tier: TLoyaltyTier;
  minLifetimeEarned: number;
}

export interface ITierProgress {
  currentTier: TLoyaltyTier;
  nextTier: TLoyaltyTier | null;   // null when already at the top tier
  pointsToNextTier: number | null; // null when there's no next tier
  currentTierMin: number;
  nextTierMin: number | null;
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
  | "ADMIN_ADJUSTMENT"
  | "CORRECTION";


export interface ILoyaltyTransaction {
  userId: Types.ObjectId;
  loyaltyAccountId: Types.ObjectId;

  type: TLoyaltyTransactionType;
  reason: TLoyaltyTransactionReason;

  points: number;
  balanceAfter: number;

  referenceId?: Types.ObjectId;
  referenceType?: "ORDER" | "REVIEW" | "REFERRAL" | "LOYALTY_TRANSACTION";

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


