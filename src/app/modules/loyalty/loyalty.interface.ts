import { Types } from "mongoose";

export interface ILoyalty {
  user: Types.ObjectId;
  order: Types.ObjectId;

  type: "EARN" | "REDEEM" | "REFUND" | "BONUS" | "EXPIRE";

  points: number;

  description?: string;

  expiresAt?: Date;
}