import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { WishlistServices } from "./wishlist.service";

const removeFromWishlist = catchAsync(
  async(req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const productId = req.params.productId;

    const result = await WishlistServices.removeFromWishlist(userId as string, productId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "This product removed from your wishlist",
      data: result
    })
  }
);

const addToWishlist = catchAsync(
  async(req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const payload = req.body;
    
    const result = await WishlistServices.addToWishlist(userId as string, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "This product added to your wishlist",
      data: result
    })
  }
);

export const WishlistControllers = {
  removeFromWishlist,
  addToWishlist
}