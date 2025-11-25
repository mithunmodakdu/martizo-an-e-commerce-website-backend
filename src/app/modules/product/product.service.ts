import AppError from "../../errorHelpers/AppError";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import httpStatusCodes from "http-status-codes";

const createProduct = async(payload: Partial<IProduct>) =>{
  const existedProduct = await Product.findOne({title: payload.title});

  if(existedProduct){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "This product already exists")
  }

  const product = await Product.create(payload);

  return product;
}

export const ProductServices = {
  createProduct
}