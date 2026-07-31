import { Types } from "mongoose";

export interface ILoyaltyAccount {
  userId: Types.ObjectId;
  totalPoints: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  lifetimeExpired: number;
}

export type ILoyaltyAccountDocument = ILoyaltyAccount & Document;


export enum LoyaltyTransactionType {
  EARN = 'EARN',
  REDEEM = 'REDEEM',
  EXPIRE = 'EXPIRE',
  ADJUST = 'ADJUST',
  REVERSE = 'REVERSE',
}

export interface ILoyaltyTransaction {
  userId: Types.ObjectId;
  type: LoyaltyTransactionType;
  points: number; 
  remainingPoints: number; 
  orderId?: Types.ObjectId;
  description: string;
  expiresAt?: Date; 
  isExpired: boolean;
  metadata?: Record<string, unknown>;
}

export type ILoyaltyTransactionDocument = ILoyaltyTransaction & Document;

export interface IEarnLoyaltyPointsPayload {
  userId: string;
  orderAmount: number; 
  orderId?: string;
  description?: string;
}







