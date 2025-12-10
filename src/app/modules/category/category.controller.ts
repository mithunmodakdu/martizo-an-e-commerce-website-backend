import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CategoryServices } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { ICategory } from "./category.interface";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload : ICategory = {
      ...req.body,
      icon: req.file?.path
    };

    const category = await CategoryServices.createCategory(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "Category created successfully.",
      data: category,
    });
  }
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const updatedCategory = await CategoryServices.updateCategory(id, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  }
);

export const CategoryControllers = {
  createCategory,
  updateCategory
};
