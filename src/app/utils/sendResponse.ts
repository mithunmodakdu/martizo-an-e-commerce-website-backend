import { Response } from "express";

interface IMeta {
  total: number;
}

interface IResData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: IMeta;
  data: T;
}

export const sendResponse = <T>(res: Response, resData : IResData<T>) => {
  res.status(resData.statusCode).json({
    success: resData.success,
    message: resData.message,
    meta: resData.meta,
    data: resData.data
  });
};