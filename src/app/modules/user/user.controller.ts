/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatusCodes.CREATED,
      success: true,
      message: "User created successfully.",
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const verifiedToken = req.user as JwtPayload;

    const updatedUser = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken
    );

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers(req.query as Record<string, string>);
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "All users data retrieved successfully.",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getMe = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const {userId} = req.user as JwtPayload;
    const result = await UserServices.getMe(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Your profile retrieved successfully",
      data: result
    })
  }
);

export const UserControllers = {
  createUser,
  updateUser,
  getAllUsers,
  getMe
};
