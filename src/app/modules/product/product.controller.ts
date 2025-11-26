import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ProductServices } from "./product.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { record } from "zod";

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

const getAllProducts = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await ProductServices.getAllProducts(query as Record<string, string>);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Products retrieved successfully.",
      meta: result.meta,
      data: result.data,
    })
  }
);

export const ProductControllers = {
  createProduct,
  getAllProducts
}