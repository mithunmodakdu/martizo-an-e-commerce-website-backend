import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CartServices } from "./cart.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { ICartItem } from "./cart.interface";

const addToCart = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const payload = req.body;
    const result = await CartServices.addToCart(userId as string, payload as Partial<ICartItem>)

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "Cart created successfully",
      data: result
    })
  }
);

const getUserCart = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const result = await CartServices.getUserCart(userId);
    
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "User Cart retrieved successfully",
      data: result
    })
  }
);

const updateCartItem = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const payload = req.body;
    const result = await CartServices.updateCartItem(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "Cart item updated successfully",
      data: result
    })
  }
);

const removeCartItem = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const {productId} = req.params;
    const result = await CartServices.removeCartItem(userId, productId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "Cart item deleted successfully",
      data: result
    })
  }
);

export const CartControllers = {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem
}