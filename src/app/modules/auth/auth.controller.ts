import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const credentialsLogin = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "You logged in successfully.",
      data: loginInfo
    })
  }
);

export const AuthControllers = {
  credentialsLogin
}