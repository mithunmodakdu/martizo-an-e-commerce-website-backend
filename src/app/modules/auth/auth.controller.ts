import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { createUserTokens } from "../../utils/createUserTokens";
import { envVars } from "../../config/env";

const credentialsLogin = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

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

    setAuthCookie(res, newAccessToken)

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "New access token created successfully.",
      data: newAccessToken
    })
   }
);

const logout = catchAsync(
  async(req: Request, res: Response, next: NextFunction) =>{
   
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "You are logged out.",
      data: null
    })
  }
);

const resetPassword = catchAsync(
  async(req: Request, res: Response, next: NextFunction) =>{
    const {oldPassword, newPassword}  = req.body;
    const decodedToken = req.user;

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Password changed successfully.",
      data: null
    })
    
  }
);

const googleCallback = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if(!user){
      throw new AppError(httpStatusCodes.NOT_FOUND, "User not found");
    }

    const tokenInfo = createUserTokens(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(envVars.FRONTEND_URL)
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallback
}