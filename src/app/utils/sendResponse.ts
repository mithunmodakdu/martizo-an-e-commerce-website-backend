import { Response } from "express";


interface IMeta {
  page?: number;
  limit?: number;
  total?: number;
}

interface IResData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: IMeta;
  data: T | null | undefined;
}

export const sendResponse = <T>(res: Response, resData : IResData<T>) => {
  res.status(resData.statusCode).json({
    statusCode: resData.statusCode,
    success: resData.success,
    message: resData.message,
    meta: resData.meta,
    data: resData.data || null || undefined
  });
};

