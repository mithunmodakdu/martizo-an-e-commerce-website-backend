import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OrderServices } from "./order.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { IOrder } from "./order.interface";

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

const getOrderByOrderNo = catchAsync(
  async(req: Request, res: Response) => {
    const orderNo = req.params.orderNo;
    const result = await OrderServices.getOrderByOrderNo(orderNo as string);
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Order data retrieved successfully",
      data: result
    })
  }
)

const getOrderById = catchAsync(
  async(req: Request, res: Response) => {
    const orderId = req.params.id;
    const result = await OrderServices.getOrderById(orderId as string);
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Order data retrieved successfully",
      data: result
    })
  }
)

const getOrders = catchAsync(
  async(req: Request, res: Response) => {
    const result = await OrderServices.getOrders();

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Orders data retrieved successfully.",
      data: result
    })
  }
)

const updateOrderById = catchAsync(
  async(req: Request, res: Response) =>{
    const orderId = req.params.id;
    const payload = req.body;
    const result = await OrderServices.updateOrderById(orderId as string, payload as Partial<IOrder>);

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Order updated successfully.",
      data: result
    })
  }
)

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
  getOrderByOrderNo,
  getOrderById,
  getOrders,
  updateOrderById,
  createOrder,
  
};
