/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


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

export const UserControllers = {
  createUser,
};
