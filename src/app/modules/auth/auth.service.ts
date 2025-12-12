/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import httpStatusCodes from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken} from "../../utils/createUserTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IAuthProvider } from "../user/user.interface";


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

const setPassword = async(userId: string, plainPassword: string) => {
  const existedUser = await User.findById(userId);

  if(!existedUser){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User NOT Found")
  }

  if(existedUser.password && existedUser.auths.some(providerObject => providerObject.provider === "google")){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "You already have a password. You can reset your password from your profile password reset option.")
  }

  const hashedPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND));

  const credentialsProvider: IAuthProvider = {
    provider: "credentials",
    providerId: existedUser.email
  }

  const auths : IAuthProvider[] = [
    ...existedUser.auths,
    credentialsProvider
  ]

  existedUser.password = hashedPassword;
  existedUser.auths = auths;
  await existedUser.save();

  
}

export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  resetPassword,
  setPassword
}