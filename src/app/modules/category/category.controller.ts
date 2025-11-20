import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CategoryServices } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const createCategory = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const category = await CategoryServices.createCategory(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "Category created successfully.",
      data: category
    })
  }
);

export const CategoryControllers = {
  createCategory
} 
