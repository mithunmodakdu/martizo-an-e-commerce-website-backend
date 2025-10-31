import AppError from "../../errorHelpers/AppError";
import { EIsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatusCodes from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createUserTokens } from "../../utils/createUserTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async(payload : Partial<IUser>) => {
  const {email, password} = payload;

  const isUserExist = await User.findOne({email});

  if(!isUserExist){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Email does not exist.")
  }

  const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);

  if(!isPasswordMatched){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Password is incorrect.")
  }

  const userTokens = createUserTokens(isUserExist);

  const {password: pass, ...rest} = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest
  }
}

const getNewAccessToken = async(refreshToken: string) =>{
  
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;
  
  const isUserExist = await User.findOne({email: verifiedRefreshToken?.email});
  console.log(isUserExist)

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

  return {
    accessToken
  }
}

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken
}