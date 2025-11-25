import AppError from "../../errorHelpers/AppError";
import { IOffer } from "./offer.interface";
import { Offer } from "./offer.model";
import httpStatusCodes from "http-status-codes";

const createOffer = async(payload: Partial<IOffer>) => {
  const existedOffer = await Offer.findOne({offerType: payload.offerType});
  
  if(existedOffer){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Offer of this type already exists.")
  }

  const offer = await Offer.create(payload);

  return offer;
}

export const OfferServices = {
  createOffer
}