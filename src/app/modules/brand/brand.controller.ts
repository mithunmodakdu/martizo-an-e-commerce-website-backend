import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { BrandServices } from "./brand.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { IBrand } from "./brand.interface";

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

const deleteBrand = catchAsync(
  async(req: Request, res: Response) => {
    const brandId = req.params.id;

    await BrandServices.deleteBrand(brandId);

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "This brand deleted successfully.",
      data: null
    })
  }
);

const updateBrand = catchAsync(
  async(req: Request, res: Response) => {
    const id = req.params.id;
    const payload = {
      ...req.body,
      brandLogo: req.file?.path
    }

    const updatedBrand = await BrandServices.updateBrand(id, payload);

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "This brand updated successfully.",
      data: updatedBrand
    })
  }
);

const createBrand = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const payload: IBrand = {
      ...req.body,
      brandLogo: req.file?.path
    }
    const brand = await BrandServices.createBrand(payload);

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
  deleteBrand,
  updateBrand,
  createBrand,
  
}