/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";
import { handleZodError } from "../errorHelpers/handleZodError";
import { IErrorSource } from "../errorHelpers/error.interfaces";
import { handleDuplicateError } from "../errorHelpers/handleDuplicateError";
import { handleCastError } from "../errorHelpers/handleCastError";
import { handleValidationError } from "../errorHelpers/handleValidationError";

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorSources : IErrorSource[] = [];

  if(error.name === "ZodError"){
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as IErrorSource[];
    error = error.issues;
  }
  else if(error.code === 11000){
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;

  }else if(error.name === "CastError"){
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;

  }else if(error.name === "ValidationError"){
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as IErrorSource[];
  }
  else if(error instanceof AppError){
    statusCode = error.statusCode;
    message = error.message
  }else if(error instanceof Error){
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).send({
    success: false,
    message,
    errorSources,
    error,   
    stack: envVars.NODE_ENV === "development"? error.stack : null
  })


}