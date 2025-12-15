import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OTPServices } from "./otp.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const sendOTP = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const {name, email} = req.body;

    await OTPServices.sendOTP(name, email);

    sendResponse(res, {
      success: true, 
      statusCode: httpStatusCodes.OK,
      message: "Your OTP code has been sent to your email. Please check your email.",
      data: null
    })
  }
);

const verifyOTP = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const {email, otp} = req.body;
    await OTPServices.verifyOTP(email, otp);

     sendResponse(res, {
      success: true, 
      statusCode: httpStatusCodes.OK,
      message: "Your are verified successfully.",
      data: null
    })

  }
);

export const OTPControllers = {
  sendOTP,
  verifyOTP
}