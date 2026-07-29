import { Request, Response } from "express";
import { LoyaltyService } from "./loyalty.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const earnPoints = catchAsync(async (req: Request, res: Response) => {
  const result = await LoyaltyService.earnPoints(req.params.orderId as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Loyalty points earned successfully",
    data: result,
  });
});

export const LoyaltyController = {
  earnPoints,
};
