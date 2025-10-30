import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatusCodes from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { generateToken } from "../../utils/jwt";

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

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }

  const accessToken = generateToken(jwtPayload as JwtPayload , envVars.JWT_SECRET as string, envVars.JWT_EXPIRE_TIME as string)

  return {
    email: isUserExist.email,
    accessToken
  }
}

export const AuthServices = {
  credentialsLogin
}