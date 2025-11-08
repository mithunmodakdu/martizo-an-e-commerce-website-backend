/* eslint-disable @typescript-eslint/no-explicit-any */
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
import passport from "passport";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   
    passport.authenticate("local", async (error: any, user: any, info: any) => {

      if(error){
        return next(new AppError(401, error))
      }

      if(!user){
        return next(new AppError(httpStatusCodes.BAD_REQUEST, info.message))
      }

      const userTokens = createUserTokens(user);

      setAuthCookie(res, userTokens);

      const {password: pass, ...rest} = user.toObject();

      sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        success: true,
        message: "You logged in successfully.",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest
        }
      });
    })(req, res, next);
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const refreshToken = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;

    const newAccessToken = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    setAuthCookie(res, newAccessToken);

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "New access token created successfully.",
      data: newAccessToken,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "You are logged out.",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user;

    await AuthServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      success: true,
      message: "Password changed successfully.",
      data: null,
    });
  }
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    if (!user) {
      throw new AppError(httpStatusCodes.NOT_FOUND, "User not found");
    }

    const tokenInfo = createUserTokens(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallback,
};
