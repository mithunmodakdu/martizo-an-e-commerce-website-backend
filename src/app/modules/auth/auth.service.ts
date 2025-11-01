/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatusCodes from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/createUserTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

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
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  
  return {
    accessToken: newAccessToken
  }
  
}


const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) =>{
  
  const existedUser = await User.findById(decodedToken.userId);
  
  const isPasswordMatched = await bcryptjs.compare(oldPassword, existedUser!.password as string)
  
  if(!isPasswordMatched){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Old password does not match")
  }

  const hashedPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

  existedUser!.password = hashedPassword;

  existedUser!.save();

}

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword
}