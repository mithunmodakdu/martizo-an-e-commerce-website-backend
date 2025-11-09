/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Something went wrong";
    
  if(error.code === 11000){
    // console.log("Duplicate error:::", error)
    statusCode = 400;
    console.log(error.message)
    const duplicate = error.message.match(/"([^"]*)"/);
    // console.log(duplicate)
    // console.log(duplicate[1])
    message = `${duplicate[1]} already exists.`
  }else if(error.name === "CastError"){
    statusCode = 400;
    message = "Invalid MongoDB ObjectID. Please provide a valid ObjectID.";
  }
  else if(error instanceof AppError){
    statusCode = error.statusCode;
    message = error.message
  }else if(error instanceof Error){
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error,
    stack: envVars.NODE_ENV === "development"? error.stack : null
  })


}