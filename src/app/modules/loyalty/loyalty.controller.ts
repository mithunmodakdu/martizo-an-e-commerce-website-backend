import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { LoyaltyServices } from "./loyalty.service";
import mongoose, { Types } from "mongoose";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { IRedeemPointsPayload } from "./loyalty.interface";

const getLoyaltyAccountByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req?.user?.userId as Types.ObjectId;
    const result = await LoyaltyServices.getLoyaltyAccountByUserId(userId);
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Your Loyalty Account retrieved successfully.",
      data: result,
    });
  },
);

const getLoyaltyAccountWithProgress = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req?.user?.userId as Types.ObjectId;
    const result = await LoyaltyServices.getLoyaltyAccountWithProgress(userId);
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Your Loyalty Account with progress retrieved successfully.",
      data: result,
    });
  },
);

const redeemLoyaltyPoints = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId as Types.ObjectId;

  const redeemPayload: IRedeemPointsPayload = {
    userId,
    orderId: req.body.orderId ? req.body.orderId : undefined,
    points: req.body.points,
    description: req.body.description ? req.body.description : undefined,
  };

  const result = await LoyaltyServices.redeemLoyaltyPoints(redeemPayload);

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "Your Loyalty points redeemed successfully.",
    data: result,
  });
});

const bonusLoyaltyPoints = catchAsync(async (req, res) => {
  const result = await LoyaltyServices.bonusLoyaltyPoints({
    userId: req?.user?.userId,
    points: req.body.points,
    reason: req.body.reason,
    referenceId: req.body.referenceId ? req.body.referenceId : undefined,
    referenceType: req.body.referenceType,
    description: req.body.description,
  });

  sendResponse(res, {
    statusCode: httpStatusCodes.CREATED,
    success: true,
    message: "Bonus loyalty points granted successfully",
    data: result,
  });
});

const adjustLoyaltyPoints = catchAsync(async (req, res) => {
  const result = await LoyaltyServices.adjustLoyaltyPoints({
    userId: req?.user?.userId,
    points: req.body.points,
    reason: req.body.reason,
    description: req.body.description,
  });

  sendResponse(res, {
    statusCode: httpStatusCodes.CREATED,
    success: true,
    message: "Loyalty points adjusted successfully",
    data: result,
  });
});

const reverseLoyaltyTransaction = catchAsync(async (req, res) => {
  const result = await LoyaltyServices.reverseLoyaltyTransaction(
    new mongoose.Types.ObjectId(req?.params?.transactionId as string),
  );

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: "Loyalty Transaction reversed successfully",
    data: result,
  });
});

export const LoyaltyController = {
  getLoyaltyAccountByUserId,
  getLoyaltyAccountWithProgress,
  redeemLoyaltyPoints,
  bonusLoyaltyPoints,
  adjustLoyaltyPoints,
  reverseLoyaltyTransaction,
};
