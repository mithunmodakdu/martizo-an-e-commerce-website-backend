/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
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
    const result = await UserServices.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "All users data retrieved successfully.",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const UserControllers = {
  createUser,
  updateUser,
  getAllUsers,
};
