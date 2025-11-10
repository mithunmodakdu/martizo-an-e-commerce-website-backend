/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Something went wrong";
  const errorSources : any = [];

  if(error.name === "ZodError"){
    statusCode = 400;
    message = "Zod Error"
    error.issues.forEach((issue: any) => errorSources.push(
        {
          path: issue.path[issue.path.length - 1],
          message: issue.message
        }
      )
    )

    error = error.issues;
  }
  else if(error.code === 11000){
    // console.log("Duplicate error:::", error)
    statusCode = 400;
    // console.log(error.message)
    const duplicate = error.message.match(/"([^"]*)"/);
    // console.log(duplicate)
    // console.log(duplicate[1])
    message = `${duplicate[1]} already exists.`

  }else if(error.name === "CastError"){
    statusCode = 400;
    message = error.message;

  }else if(error.name === "ValidationError"){
    statusCode = 400;
    message = "ValidationError";
    const errors = Object.values(error.errors);
    errors.forEach((errorItem : any) => errorSources.push(
      {
        path: errorItem.path,
        message: errorItem.message
      }
    ))
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
    error   
    // stack: envVars.NODE_ENV === "development"? error.stack : null
  })


}