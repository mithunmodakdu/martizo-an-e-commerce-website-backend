/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = 500;
  const message = `Something went wrong ${error.message}`;
  
  res.status(500).json({
    success: false,
    message,
    error,
    stack: envVars.NODE_ENV === "development"? error.stack : null
  })


}