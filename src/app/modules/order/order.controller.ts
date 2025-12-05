import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OrderServices } from "./order.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const createOrder = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const payload = req.body;
    const result = await OrderServices.createOrder(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "You have ordered successfully.",
      data: result
    })
  }
);

export const OrderControllers = {
  createOrder
}