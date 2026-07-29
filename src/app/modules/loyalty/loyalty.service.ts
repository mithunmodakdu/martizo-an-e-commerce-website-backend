import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { TLoyaltyReason } from "./loyalty.interface";
import { User } from "../user/user.model";
import { LoyaltyTransaction } from "./loyalty.model";

export async function addPoints(
  userId: string,
  points: number,
  reason: TLoyaltyReason,
  opts: { orderId?: string; expiresAt?: Date; meta?: Record<string, unknown> } = {}
) {
  if (points <= 0) throw new AppError( 400, 'Points to add must be positive');

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { loyaltyPoints: points } },
        { new: true, session }
      );

      if (!user) throw new AppError(404, 'User not found');

      const [txn] = await LoyaltyTransaction.create(
        [
          {
            user: userId,
            order: opts.orderId,
            points,
            balanceAfter: user.loyaltyPoints,
            reason,
            expiresAt: opts.expiresAt,
            meta: opts.meta,
          },
        ],
        { session }
      );

      result = txn;
    });

    return result;
    
  } finally {
    session.endSession();
  }
}

