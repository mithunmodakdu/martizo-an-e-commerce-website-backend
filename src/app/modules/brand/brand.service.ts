import AppError from "../../errorHelpers/AppError";
import { IBrand } from "./brand.interface";
import { Brand } from "./brand.model";
import httpStatusCodes from "http-status-codes";

const getAllBrands = async() => {
  const allBrands = await Brand.find();
  return allBrands;
}
const createBrand = async(payload: Partial<IBrand>) => {
  const existedBrand = await Brand.findOne({name: payload.name});

  if(existedBrand){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "This brand name already exists.")
  }

  const brand = await Brand.create(payload);

  return brand;
}

export const BrandServices = {
  getAllBrands,
  createBrand
}