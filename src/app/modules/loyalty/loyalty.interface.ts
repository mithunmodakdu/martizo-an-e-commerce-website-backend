import { Types } from "mongoose";

export type TLoyaltyTier =
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM";

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
