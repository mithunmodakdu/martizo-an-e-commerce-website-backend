import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import httpStatusCodes from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles : string[]) => async(req: Request, res: Response, next: NextFunction) => {
  // console.log(authRoles)
  
  try {
    // const accessToken = req.headers.authorization;
    const accessToken = req.cookies.accessToken;
    // console.log(accessToken) 
    if(!accessToken){
      throw new AppError(httpStatusCodes.UNAUTHORIZED, "No access token received.")
    }

    const verifiedToken = verifyToken(accessToken as string, envVars.JWT_SECRET) as JwtPayload;
    // console.log(verifiedToken)
    if(!authRoles.includes(verifiedToken.role)){
      throw new AppError(httpStatusCodes.FORBIDDEN, "This route is forbidden for you.")
    }

    req.user = verifiedToken;

    next()
  } catch (error) {
    next(error)
  }
}