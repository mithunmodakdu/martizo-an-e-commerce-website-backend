import { ClientSession } from "mongoose";
import { IEarnPointsPayload, ILoyaltyTransaction } from "./loyalty.interface";
import { LoyaltyAccount, LoyaltyTransaction } from "./loyalty.model";

const createLoyaltyTransaction = async (
  data: ILoyaltyTransaction,
  session?: ClientSession,
) => {
  const createdLoyaltyTransaction = await LoyaltyTransaction.create([data], {
    session,
  });
  return createdLoyaltyTransaction[0];
};

const earnPointsFromOrder = async (
  payload: IEarnPointsPayload,
  session?: ClientSession,
) => {
  const { userId, orderId, eligibleOrderAmount } = payload;
  const points = Math.floor(eligibleOrderAmount / 100);

  const loyaltyAccount = await LoyaltyAccount.findOne({ userId });

  if (!loyaltyAccount) {
    throw new Error(`No loyalty account found for user ${userId}`);
  }

  // create Loyalty Transaction
  await createLoyaltyTransaction(
    {
      userId,
      loyaltyAccountId: loyaltyAccount._id,
      type: "EARN",
      reason: "ORDER",
      points,
      referenceId: orderId,
      referenceType: "ORDER",
      description: `Earned ${points} points for order ${orderId}`,
    },
    session,
  );

  // Increase loyalty balance
  loyaltyAccount.availablePoints += points;
  loyaltyAccount.lifetimeEarned += points;
  await loyaltyAccount.save({session}); 

};

export const LoyaltyServices = {
  earnPointsFromOrder,
};
