import  mongoose, { ClientSession } from "mongoose";
import { LoyaltyAccount, LoyaltyTransaction } from "./loyalty.model";
import { IEarnLoyaltyPointsPayload, LoyaltyTransactionType } from "./loyalty.interface";
import { LOYALTY_CONFIG } from "./loyalty.constants";
import AppError from "../../errorHelpers/AppError";
import httpStatusCodes from "http-status-codes";


export const getOrCreateLoyaltyAccount = async(userId: string, session?: ClientSession) => {
  let loyaltyAccount = await LoyaltyAccount.findOne({userId}).session(session?? null);

  if(!loyaltyAccount){
    const createdLoyaltyAccount = await LoyaltyAccount.create(
      [
        {
          userId,
          totalPoints: 0,
          lifetimeEarned: 0,
          lifetimeRedeemed: 0,
          lifetimeExpired: 0
        }
      ],
      {session}
    );

    loyaltyAccount = createdLoyaltyAccount[0];
  }

  return loyaltyAccount;
}

export const earnLoyaltyPoints = async (payload: IEarnLoyaltyPointsPayload) => {
  const { userId, orderAmount, orderId, description } = payload;

  if (orderAmount <= 0) {
    throw new AppError(httpStatusCodes.BAD_REQUEST, 'Order amount must be greater than 0');
  }

  const pointsToEarn = Math.floor(orderAmount * LOYALTY_CONFIG.POINTS_EARN_RATE);

  if (pointsToEarn <= 0) {
    return null; // order too small to earn any whole points; nothing to do
  }

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const loyaltyAccount = await getOrCreateLoyaltyAccount(userId, session);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + LOYALTY_CONFIG.POINTS_EXPIRY_DAYS);

      const [loyaltyTransaction] = await LoyaltyTransaction.create(
        [
          {
            user: userId,
            type: LoyaltyTransactionType.EARN,
            points: pointsToEarn,
            remainingPoints: pointsToEarn,
            order: orderId,
            description: description ?? `Earned from order${orderId ? ` #${orderId}` : ''}`,
            expiresAt,
          },
        ],
        { session },
      );

      loyaltyAccount.totalPoints += pointsToEarn;
      loyaltyAccount.lifetimeEarned += pointsToEarn;
      await loyaltyAccount.save({ session });

      result = loyaltyTransaction;
    });

    return result;
  } finally {
    session.endSession();
  }
};


export const LoyaltyService = {
  earnLoyaltyPoints
};






