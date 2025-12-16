import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import AppError from "../../errorHelpers/AppError";
import httpStatusCodes from "http-status-codes";
import { User } from "../user/user.model";

const OTP_Expiration = 2 * 60;

const generateOTP = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
}

const sendOTP = async(name: string, email: string) => {

  const existedUser = await User.findOne({email});

  if(!existedUser){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User NOT Found.");
  }

  if(existedUser.isVerified){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User is already verified.");
  }

  const otp = Number(generateOTP());

  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_Expiration
    }
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name,
      otp
    }
  });
}

const verifyOTP = async(email: string, otp: string) => {

  const existedUser = await User.findOne({email});

  if(!existedUser){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User NOT Found.");
  }

  if(existedUser.isVerified){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User is already verified.");
  }

  const redisKey = `otp:${email}`;

  const savedOtp = await redisClient.get(redisKey);

  if(!savedOtp){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Your OTP code expired.")
  }

  if(savedOtp !== otp){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Your OTP code is invalid.")
  }

  await Promise.all([
    User.updateOne({email}, {isVerified: true}, {runValidators: true}),
    redisClient.del([redisKey])
  ])

}

export const OTPServices = {
  sendOTP,
  verifyOTP
}



