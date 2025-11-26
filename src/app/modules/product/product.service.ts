import AppError from "../../errorHelpers/AppError";
import { productSearchableFields } from "./product.constants";
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

const getAllProducts = async(query : Record<string, string>) => {
  const filter = query;
  const searchTerm = query.searchTerm || "";

  delete filter["searchTerm"]

  const searchQuery = {
    $or: productSearchableFields.map((field) => ({
      [field] : {$regex: searchTerm, $options: "i"}
    }))
    
  }

  const products = await Product.find(filter).find(searchQuery);

  const totalProducts = await Product.countDocuments();

  return {
    meta: {total: totalProducts},
    data: products
  };
}

export const ProductServices = {
  createProduct,
  getAllProducts
}