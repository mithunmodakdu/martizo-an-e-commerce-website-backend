/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import httpStatusCodes from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken } from "../../utils/createUserTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { EIsActive, IAuthProvider } from "../user/user.interface";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const existedUser = await User.findById(decodedToken.userId);

  const isPasswordMatched = await bcryptjs.compare(
    oldPassword,
    existedUser!.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "Old password does not match"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  existedUser!.password = hashedPassword;

  existedUser!.save();
};

const setPassword = async (userId: string, plainPassword: string) => {
  const existedUser = await User.findById(userId);

  if (!existedUser) {
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User NOT Found");
  }

  if (
    existedUser.password &&
    existedUser.auths.some(
      (providerObject) => providerObject.provider === "google"
    )
  ) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "You already have a password. You can reset your password from your profile password reset option."
    );
  }

  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialsProvider: IAuthProvider = {
    provider: "credentials",
    providerId: existedUser.email,
  };

  const auths: IAuthProvider[] = [...existedUser.auths, credentialsProvider];

  existedUser.password = hashedPassword;
  existedUser.auths = auths;
  await existedUser.save();
};

const forgotPassword = async (email: string) => {
  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User does not exist");
  }

  if (!existedUser.isVerified) {
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User is not verified.");
  }

  if (
    existedUser.isActive === EIsActive.INACTIVE ||
    existedUser.isActive === EIsActive.BLOCKED
  ) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      `User is ${existedUser.isActive}`
    );
  }

  if (existedUser.isDeleted) {
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User is deleted.");
  }

  const jwtPayload = {
    userId: existedUser._id,
    email: existedUser.email,
    role: existedUser.role,
  };
  const forgotPasswordResetToken = jwt.sign(jwtPayload, envVars.JWT_SECRET, {
    expiresIn: "10m",
  });

  const forgotPasswordResetUILink = `${envVars.FRONTEND_URL}/forgot-password-reset?id=${existedUser._id}&token=${forgotPasswordResetToken}`;

  sendEmail({
    to: existedUser.email,
    subject: "Forgot Password Reset",
    templateName: "forgotPassword",
    templateData: {
      name: existedUser.name,
      forgotPasswordResetUILink
    }
  })
};

const forgotPasswordReset = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {

  if(!payload.userId === decodedToken.userId){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "You can not reset your password.")
  }

  const existedUser = await User.findById(decodedToken.userId);

  if(!existedUser){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User does not exist.")
  }

  const hashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  existedUser!.password = hashedPassword;

  existedUser!.save();
};

export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  resetPassword,
  setPassword,
  forgotPassword,
  forgotPasswordReset
};
