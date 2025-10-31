import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";
import { envVars } from "../config/env";

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