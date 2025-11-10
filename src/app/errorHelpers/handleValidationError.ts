import mongoose from "mongoose";
import { IErrorResponse, IErrorSource } from "./error.interfaces";

export const handleValidationError = (error: mongoose.Error.ValidationError): IErrorResponse => {
  const errorSources: IErrorSource[] = [];
  const errors = Object.values(error.errors);
  errors.forEach((errorItem: any) =>
    errorSources.push({
      path: errorItem.path,
      message: errorItem.message,
    })
  );
  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};
