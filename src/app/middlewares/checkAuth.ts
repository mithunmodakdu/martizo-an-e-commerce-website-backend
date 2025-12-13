import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import httpStatusCodes from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { EIsActive } from "../modules/user/user.interface";

export const checkAuth = (...authRoles : string[]) => async(req: Request, res: Response, next: NextFunction) => {
  // console.log(authRoles)
  
  try {
  
    const accessToken = req.headers.authorization || req.cookies.accessToken;
    
    if(!accessToken){
      throw new AppError(httpStatusCodes.UNAUTHORIZED, "No access token received.")
    }

    const verifiedToken = verifyToken(accessToken as string, envVars.JWT_SECRET) as JwtPayload;

    const existedUser = await User.findOne({email: verifiedToken.email})

    if(!existedUser){
      throw new AppError(httpStatusCodes.BAD_REQUEST, "User does not exist")
    }

    if(existedUser.isVerified){
      throw new AppError(httpStatusCodes.BAD_REQUEST, "User is not verified.")
    }

    if(existedUser.isActive === EIsActive.INACTIVE || existedUser.isActive === EIsActive.BLOCKED){
      throw new AppError(httpStatusCodes.BAD_REQUEST, `User is ${existedUser.isActive}`)
    }

    if(existedUser.isDeleted){
      throw new AppError(httpStatusCodes.BAD_REQUEST, "User is deleted.")
    }
    
    if(!authRoles.includes(verifiedToken.role)){
      throw new AppError(httpStatusCodes.FORBIDDEN, "This route is forbidden for you.")
    }

    req.user = verifiedToken;

    next()
  } catch (error) {
    next(error)
  }
}