import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { LoyaltyServices } from "./loyalty.service";
import { Types } from "mongoose";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const getLoyaltyAccountByUserId = catchAsync(
  async(req: Request, res: Response) => {
    const userId = req?.user?.userId as Types.ObjectId;
    const result = await LoyaltyServices.getLoyaltyAccountByUserId(userId);
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Your Loyalty Account retrieved successfully.",
      data: result
    })
  }
);

export const LoyaltyController = {
  getLoyaltyAccountByUserId
}