import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CategoryServices } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { ICategory } from "./category.interface";

const getAllCategories = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const allCategories = await CategoryServices.getAllCategories();

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "All categories retrieved successfully.",
      data: allCategories
    })
  }
);

const getCategoryById = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;
    const category = await CategoryServices.getCategoryById(categoryId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Category retrieved successfully.",
      data: category
    })
  }
);

const deleteCategory = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;

    await CategoryServices.deleteCategory(categoryId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Category deleted successfully.",
      data: null
    })
  }
);

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
    const payload = {
      ...req.body,
      icon: req.file?.path
    };
    
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
  getAllCategories,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory
};
