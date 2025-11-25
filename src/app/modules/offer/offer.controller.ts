import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OfferServices } from "./offer.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCodes from "http-status-codes";

const createOffer = catchAsync(
  async(req: Request, res: Response, next: NextFunction) => {
    const offer = await OfferServices.createOffer(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: "Offer created successfully.",
      data: offer
    });
  }
);

export const OfferControllers = {
  createOffer
}