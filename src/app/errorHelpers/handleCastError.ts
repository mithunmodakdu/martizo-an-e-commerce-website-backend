import mongoose from "mongoose";
import { IErrorResponse } from "./error.interfaces";

export const handleCastError = (error: mongoose.Error.CastError): IErrorResponse => {
  return {
    statusCode: 400,
    message: error.message,
  };
};
