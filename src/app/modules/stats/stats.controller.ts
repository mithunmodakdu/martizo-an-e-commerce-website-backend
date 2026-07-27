import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";
import { StatsServices } from "./stats.service";
import { JwtPayload } from "jsonwebtoken";

const getMyStats = catchAsync(
  async(req: Request, res: Response) => {
    const userId = req?.user?.userId as JwtPayload;
    const result = await StatsServices.getMyStats(userId);
     sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "My Stats retrieved successfully.",
      data: result
    })
  }
)

const getUsersStats = catchAsync(
  async(req: Request, res: Response, next: NextFunction)=> {
    const stats = await StatsServices.getUsersStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Users Stats retrieved successfully.",
      data: stats 
    })
}) 

const getProductsStats = catchAsync(
  async(req: Request, res: Response, next: NextFunction)=> {
    const stats = await StatsServices.getProductsStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Products Stats retrieved successfully.",
      data: stats 
    })
}) 

const getOrdersStats = catchAsync(
  async(req: Request, res: Response, next: NextFunction)=> {
    const stats = await StatsServices.getOrdersStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Orders Stats retrieved successfully.",
      data: stats 
    })
}) 

const getPaymentsStats = catchAsync(
  async(req: Request, res: Response, next: NextFunction)=> {
    const stats = await StatsServices.getPaymentsStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.OK,
      message: "Payments Stats retrieved successfully.",
      data: stats 
    })
}) 

export const StatsControllers = {
  getMyStats,
  getUsersStats,
  getProductsStats,
  getOrdersStats,
  getPaymentsStats
}