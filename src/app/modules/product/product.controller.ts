import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ProductServices } from "./product.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) =>{
    const product = await ProductServices.createProduct(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "Product created successfully.",
      data: product
    })
  }
);

export const ProductControllers = {
  createProduct
}