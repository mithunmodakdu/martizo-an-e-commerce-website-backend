import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ProductServices } from "./product.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

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

const deleteProduct = catchAsync(
  async(req: Request, res: Response) => {
    const productId = req.params.id;

    await ProductServices.deleteProduct(productId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "This product deleted successfully.",
      data: null
    })
  }
);

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) =>{
    // console.log(req.body)
    // console.log(req.files)

    const files = req.files as {
      file?: Express.Multer.File[];
      files?: Express.Multer.File[];
    }

    const payload : IProduct = {
      ...req.body,
      thumbnail: files.file?.[0].path,
      images: files.files?.map(file => file.path)
    }

    // console.log(payload)

    const product = await ProductServices.createProduct(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "Product created successfully.",
      data: product
    })
  }
);

const updateProduct = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const productSlug = req.params.slug as string;
    
    // console.log(productSlug)
    // console.log(req.files?.file?.[0].path)
    // console.log(req.files?.files)
    
    const payload = {
      ...req.body,
      thumbnail: req.files?.file?.[0].path,
      images: (req.files?.files as Express.Multer.File[]).map(file => file.path)
    };
    // console.log(payload)

    const updatedProduct = await ProductServices.updateProduct(productSlug, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Product updated successfully.",
      data: updatedProduct
    })
  }
);

export const ProductControllers = {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  createProduct,
  updateProduct
}