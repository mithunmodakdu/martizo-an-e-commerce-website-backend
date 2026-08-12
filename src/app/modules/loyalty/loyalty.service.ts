import { ClientSession, Types } from "mongoose";
import {
  IEarnPointsPayload,
  ILoyaltyTransaction,
  ITierThreshold,
  TLoyaltyTier,
} from "./loyalty.interface";
import { LoyaltyAccount, LoyaltyTransaction } from "./loyalty.model";
import AppError from "../../errorHelpers/AppError";
import httpStatusCodes from "http-status-codes";

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

const getOrCreateLoyaltyAccount = async (
  userId: Types.ObjectId,
  session?: ClientSession,
) => {
  let loyaltyAccount = await LoyaltyAccount.findOne({ userId }).session(
    session ?? null,
  );

  if (!loyaltyAccount) {
    const createdLoyaltyAccount = await LoyaltyAccount.create(
      [
        {
          userId,
          availablePoints: 0,
          pendingPoints: 0,
          lifetimeEarned: 0,
          lifetimeRedeemed: 0,
          tier: "BRONZE",
        },
      ],
      {
        session,
      },
    );
    loyaltyAccount = createdLoyaltyAccount[0];
  }

  return loyaltyAccount;
};

const writeLoyaltyLedgerEntry = async (
  params: {
    userId: Types.ObjectId;
    points: number;
    type: ILoyaltyTransaction["type"];
    reason: ILoyaltyTransaction["reason"];
    referenceId?: Types.ObjectId;
    referenceType?: ILoyaltyTransaction["referenceType"];
    reversalOf?: Types.ObjectId;
    description?: string;
  },
  session: ClientSession,
) => {
  // loyalty Account related
  const loyaltyAccount = await getOrCreateLoyaltyAccount(
    params.userId,
    session,
  );

  const nextAvailablePoints = loyaltyAccount.availablePoints + params.points;

  if (nextAvailablePoints < 0) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "Insufficient loyalty points balance",
    );
  }

  loyaltyAccount.availablePoints = nextAvailablePoints;

  if (params.points > 0 && ["EARN", "BONUS"].includes(params.type)) {
    loyaltyAccount.lifetimeEarned += params.points;
  }

  if (params.type === "REDEEM") {
    loyaltyAccount.lifetimeRedeemed += Math.abs(params.points);
  }

  loyaltyAccount.tier = calculateTier(loyaltyAccount.lifetimeEarned);

  await loyaltyAccount.save({ session });

  // loyalty transaction related
  const [loyaltyTransaction] = await LoyaltyTransaction.create(
    [
      {
        userId: params.userId,
        loyaltyAccountId: loyaltyAccount._id,
        type: params.type,
        reason: params.reason,
        points: params.points,
        balanceAfter: loyaltyAccount.availablePoints,
        referenceId: params.referenceId,
        referenceType: params.referenceType,
        reversalOf: params.reversalOf,
        description: params.description,
      },
    ],
    { session },
  );

  // return
  return {
    loyaltyAccount,
    loyaltyTransaction
  }
};

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
  getOrCreateLoyaltyAccount,
  earnPointsFromOrder,
  calculateTier,
  calculateEarnedPoints,
};
