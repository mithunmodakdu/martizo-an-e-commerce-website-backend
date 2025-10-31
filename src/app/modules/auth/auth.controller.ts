import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const credentialsLogin = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      secure: false
    })

    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      secure: false
    })

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "You logged in successfully.",
      data: loginInfo
    })
  }
);

const getNewAccessToken = catchAsync(
   async(req: Request, res: Response, next: NextFunction) => {
    // const refreshToken = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;
    const newAccessToken = await AuthServices.getNewAccessToken(refreshToken as string);

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "New access token created successfully.",
      data: newAccessToken
    })
   }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken
}