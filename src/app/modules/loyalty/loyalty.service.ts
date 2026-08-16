import mongoose, { ClientSession, Types } from "mongoose";
import {
  IAdjustPointsPayload,
  IBonusPointsPayload,
  IEarnPointsPayload,
  ILoyaltyTransaction,
  IRedeemPointsPayload,
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

const getLoyaltyAccountByUserId = async (userId: Types.ObjectId) => {
  const loyaltyAccount = await LoyaltyAccount.findOne({ userId });
  if (!loyaltyAccount) {
    throw new AppError(
      httpStatusCodes.NOT_FOUND,
      "Your Loyalty Account Not Found",
    );
  }
  return loyaltyAccount;
};

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
    loyaltyTransaction,
  };
};

const earnLoyaltyPoints = async (payload: IEarnPointsPayload) => {
  const points = calculateEarnedPoints(payload.eligibleOrderAmount);

  if (points <= 0) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "Order amount does not qualify for any loyalty points",
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await writeLoyaltyLedgerEntry(
      {
        userId: payload.userId,
        points,
        type: "EARN",
        reason: "ORDER",
        referenceId: payload.orderId,
        referenceType: "ORDER",
        description: `Earned from order ${payload.orderId.toString()}`,
      },
      session,
    );

    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();

    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      throw new AppError(
        httpStatusCodes.CONFLICT,
        "Points have already been earned for this order",
      );
    }

    throw error;
  } finally {
    session.endSession();
  }
};

const redeemLoyaltyPoints = async(payload: IRedeemPointsPayload) => {
    if (payload.points <= 0) {
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Redeem points must be positive");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await writeLoyaltyLedgerEntry(
      {
        userId: payload.userId,
        points: -Math.abs(payload.points),
        type: "REDEEM",
        reason: "REDEMPTION",
        referenceId: payload.orderId,
        referenceType: payload.orderId ? "ORDER" : undefined,
        description: payload.description ?? "Points redeemed",
      },
      session,
    );

    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

}


const bonusLoyaltyPoints = async (payload: IBonusPointsPayload) => {
  if (payload.points <= 0) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "Bonus Loyalty points must be positive",
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await writeLoyaltyLedgerEntry(
      {
        userId: payload.userId,
        points: payload.points,
        type: "BONUS",
        reason: payload.reason,
        referenceId: payload.referenceId,
        referenceType: payload.referenceType,
        description: payload.description,
      },
      session,
    );

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const adjustLoyaltyPoints = async(payload: IAdjustPointsPayload) => {

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await writeLoyaltyLedgerEntry({
      userId: payload.userId,
      points: payload.points,
      type: "ADJUSTMENT",
      reason: payload.reason,
      description: payload.description ?? "Manual admin adjustment"
    }, session)

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }finally{
    session.endSession();
  }
}

export const LoyaltyServices = {
  getLoyaltyAccountByUserId,
  getOrCreateLoyaltyAccount,
  earnLoyaltyPoints,
  redeemLoyaltyPoints,
  bonusLoyaltyPoints,
  adjustLoyaltyPoints
};
