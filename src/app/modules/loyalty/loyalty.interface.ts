import { Types } from "mongoose";

export type TLoyaltyTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export interface ILoyaltyAccount {
  userId: Types.ObjectId;
  availablePoints: number;
  pendingPoints: number;
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

  referenceId?: Types.ObjectId;
  referenceType?: "ORDER" | "REVIEW" | "REFERRAL";

  description?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

