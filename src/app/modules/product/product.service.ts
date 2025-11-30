import AppError from "../../errorHelpers/AppError";
import { excludeFields, productSearchableFields } from "./product.constants";
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
  const sort = query.sort || "-createdAt";
  const fields = query.fields.split(",").join(" ") || "";
   console.log(fields)


  for(const field of excludeFields){
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete filter[field]
  }

  const searchQuery = {
    $or: productSearchableFields.map((field) => ({
      [field] : {$regex: searchTerm, $options: "i"}
    }))
    
  }

  const products = await Product.find(searchQuery).find(filter).sort(sort).select(fields);

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