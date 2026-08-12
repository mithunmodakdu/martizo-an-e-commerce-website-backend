import { ClientSession } from "mongoose";
import {
  IEarnPointsPayload,
  ILoyaltyTransaction,
  ITierThreshold,
  TLoyaltyTier,
} from "./loyalty.interface";
import { LoyaltyAccount, LoyaltyTransaction } from "./loyalty.model";

// 1 point per 100 BDT of eligible order amount
const CURRENCY_UNIT = 100;
const POINTS_FOR_CURRENCY_UNIT = 1;

const TIER_THRESHOLDS: ITierThreshold[] = [
  { tier: "PLATINUM", minLifetimeEarned: 20000 },
  { tier: "GOLD", minLifetimeEarned: 8000 },
  { tier: "SILVER", minLifetimeEarned: 2000 },
  { tier: "BRONZE", minLifetimeEarned: 0 },
];

const calculateTier = (lifeTimeEarned: number): TLoyaltyTier => {
  const match = TIER_THRESHOLDS.find(
    (item) => lifeTimeEarned >= item.minLifetimeEarned,
  );
  return match?.tier ?? "BRONZE";
};

const calculateEarnedPoints = (eligibleOrderAmount: number): number =>
  Math.floor((eligibleOrderAmount / CURRENCY_UNIT) * POINTS_FOR_CURRENCY_UNIT);

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
  await loyaltyAccount.save({ session });
};

export const LoyaltyServices = {
  earnPointsFromOrder,
};
