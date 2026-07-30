import { Types } from "mongoose";

// :::: Loyalty Account :::: 
export interface ILoyaltyAccount {
  userId: Types.ObjectId;
  totalPoints: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  lifetimeExpired: number;
}

export type ILoyaltyAccountDocument = ILoyaltyAccount & Document;



