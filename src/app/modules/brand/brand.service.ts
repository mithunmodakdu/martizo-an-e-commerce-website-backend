import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { IBrand } from "./brand.interface";
import { Brand } from "./brand.model";
import httpStatusCodes from "http-status-codes";

const getAllBrands = async() => {
  const allBrands = await Brand.find();
  return allBrands;
}

const deleteBrand = async(id: string) => {
  const existedBrand = await Brand.findById(id);

  if(!existedBrand){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "This brand is not found.")
  }

  await Brand.findByIdAndDelete(id);
  return null;
}

const updateBrand = async(id: string, payload: Partial<IBrand>) => {
  const existedBrand = await Brand.findById(id);
  if(!existedBrand){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "This brand is not found")
  }

  const duplicateBrand = await Brand.findOne({name: payload.name, _id: {$ne: id}});
  if(duplicateBrand){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "The brand with same name already exists");
  }

  if(payload.brandLogo && existedBrand.brandLogo){
    await deleteImageFromCloudinary(existedBrand.brandLogo);
  }

  const updatedBrand = await Brand.findByIdAndUpdate(id, payload, {new: true, runValidators: true});

  return updatedBrand;
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
  deleteBrand,
  updateBrand,
  createBrand
  
}