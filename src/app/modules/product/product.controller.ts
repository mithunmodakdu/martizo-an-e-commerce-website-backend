import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ProductServices } from "./product.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { record } from "zod";
import { IProduct } from "./product.interface";

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) =>{
    const payload : IProduct = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map(file => file.path)
    }

    const product = await ProductServices.createProduct(payload);

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

const getSingleProduct = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;

    const result = await ProductServices.getSingleProduct(slug);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Product retrieved successfully.",
      data: result.data,
    });
  }
);

const updateProduct = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;
    
    const payload = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map(file => file.path)
    };

    const updatedProduct = await ProductServices.updateProduct(productId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Product updated successfully.",
      data: updatedProduct
    })
  }
);

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct
}