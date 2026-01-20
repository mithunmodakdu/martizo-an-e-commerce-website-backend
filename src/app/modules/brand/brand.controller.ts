import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { BrandServices } from "./brand.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const getAllBrands = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const allBrands = await BrandServices.getAllBrands();
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "All brands retrieved successfully.",
      data: allBrands
    })
  }
)

const createBrand = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const brand = await BrandServices.createBrand(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "Brand created successfully.",
      data: brand
    });
  }
);

export const BrandControllers = {
  getAllBrands,
  createBrand
}