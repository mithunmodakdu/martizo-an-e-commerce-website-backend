import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OrderServices } from "./order.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const getOrderByTransactionId = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const transactionId = req.params.transactionId;
    const result = await OrderServices.getOrderByTransactionId(transactionId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Order data retrieved successfully.",
      data: result
    })
  }
);

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const payload = req.body;
    const result = await OrderServices.createOrder(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "You have ordered successfully.",
      data: result,
    });
  },
);

export const OrderControllers = {
  getOrderByTransactionId,
  createOrder,
};
