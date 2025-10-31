import { EIsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatusCodes from "http-status-codes";

export const createUserTokens = (user : Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role
  }

  const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRE_TIME);

  const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRE_TIME);

  return {
    accessToken,
    refreshToken
  }

}

export const createNewAccessTokenWithRefreshToken = async(refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;
  
  const isUserExist = await User.findOne({email: verifiedRefreshToken?.email});
  
  if(!isUserExist){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User is not found")
  }

  if(isUserExist.isDeleted){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User is deleted")
  }

  if(isUserExist.isActive === EIsActive.INACTIVE || isUserExist.isActive === EIsActive.BLOCKED){
    throw new AppError(httpStatusCodes.BAD_REQUEST, `User is ${isUserExist.isActive}`)
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }

  const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRE_TIME);

  return accessToken;
  
}