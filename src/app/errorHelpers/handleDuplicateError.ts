/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorResponse } from "./error.interfaces";

export const handleDuplicateError = (error: any): IErrorResponse => {
  
  const duplicate = error.message.match(/"([^"]*)"/);

  return {
    statusCode: 400,
    message: `${duplicate[1]} already exists.`,
  };
};
