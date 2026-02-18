/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { productSearchableFields } from "./product.constants";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import httpStatusCodes from "http-status-codes";


// const getAllProducts = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.split(",").join(" ") || "";
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 5;
//   const skip = (page - 1) * limit;

//   for (const field of excludeFields) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const searchQuery = {
//     $or: productSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };

//   // const products = await Product.find(filter)
//   //   .find(searchQuery)
//   //   .sort(sort)
//   //   .select(fields)
//   //   .limit(limit)
//   //   .skip(skip);

//   const productsByFilter = Product.find(filter);
//   const productsBySearch = productsByFilter.find(searchQuery);
//   const products = await productsBySearch.sort(sort).select(fields).skip(skip).limit(limit);

//   const totalProducts = await Product.countDocuments();
//   const totalPage = Math.ceil(totalProducts / limit);

//   const meta = {
//     page: page,
//     limit: limit,
//     total: totalProducts,
//     totalPage: totalPage,
//   };

//   return {
//     meta: meta,
//     data: products,
//   };
// };

const getAllProducts = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Product.find(), query);

  const products = await queryBuilder
    .filter()
    .search(productSearchableFields)
    .sort()
    .fields()
    .paginate()
    .populate([
      { path: "category", select: "_id, name slug" },
      { path: "brand", select: "_id, name" },
    ]);
    

  const [data, meta] = await Promise.all([
    products.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    meta: meta,
    data: data,
  };
};

const getSingleProduct = async (slug: string) => {
  const product = await Product.findOne({ slug });

  return {
    data: product,
  };
};

const createProduct = async (payload: Partial<IProduct>) => {
  const existedProduct = await Product.findOne({ title: payload.title });

  if (existedProduct) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "This product already exists"
    );
  }

  const product = await Product.create(payload);

  return product;
};

const deleteProduct = async(productId: string) => {
  const existedProduct = await Product.findById(productId);

  if(!existedProduct){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "This product is not found.");
  }

  await Product.findByIdAndDelete(productId);

  return null;
}

const updateProduct = async (productSlug: string, payload: Partial<IProduct>) => {
  const existedProduct = await Product.findOne({slug: productSlug});

  if (!existedProduct) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "This product does not exist."
    );
  }

  // if (
  //   payload.images &&
  //   payload.images.length > 0 &&
  //   existedProduct.images &&
  //   existedProduct.images.length > 0
  // ) {
  //   payload.images = [...payload.images, ...existedProduct.images];
  // }

  // if (
  //   payload.deleteImages &&
  //   payload.deleteImages.length > 0 &&
  //   existedProduct.images &&
  //   existedProduct.images.length > 0
  // ) {
  //   const restExistedProductImages = existedProduct.images.filter(
  //     (imageUrl) => !payload.deleteImages?.includes(imageUrl)
  //   );

  //   const onlyNewPayloadImages = (payload.images || [])
  //     .filter((imageUrl) => !payload.deleteImages?.includes(imageUrl))
  //     .filter((imageUrl) => !restExistedProductImages.includes(imageUrl));

  //   payload.images = [...restExistedProductImages, ...onlyNewPayloadImages];
  // }

  
  const existedImages = existedProduct.images || [];
  const newImages = payload.images || [];
  const deleteImages = payload.deleteImages || [];

  // 1. Keep only existing images that are NOT deleted
  const remainingExistedImages = existedImages.filter((img) => !deleteImages.includes(img));

  // 2. Keep only new images that are NOT deleted
  const validNewImages = newImages.filter((img) => !deleteImages.includes(img));

  // 3. Merge both
  payload.images = [...remainingExistedImages, ...validNewImages];

  // For zero duplicates
  payload.images = [...new Set(payload.images)];

  const existedThumbnail = existedProduct.thumbnail;
  const newThumbnail = payload.thumbnail;
  const deleteThumbnail = payload.deleteThumbnail;
 
  if(deleteThumbnail){
    payload.thumbnail = undefined;
  }

  if(deleteThumbnail && newThumbnail){
    payload.thumbnail = newThumbnail;
  }
  // console.log(payload)

  const updatePayload: any = {
    $set: {}
  }

  for (const key in payload){
    updatePayload.$set[key] = payload[key];
  }

  if(!("salePrice" in payload)){
    updatePayload.$unset = {salePrice: 1}
  }

  const updatedProduct = await Product.findOneAndUpdate({slug: productSlug}, updatePayload, {new: true})

  if(payload.deleteImages && payload.deleteImages.length > 0 && existedProduct.images && existedProduct.images.length > 0){
    await Promise.all(payload.deleteImages.map(url => deleteImageFromCloudinary(url)));
  }

  if(deleteThumbnail && existedThumbnail){
    await deleteImageFromCloudinary(deleteThumbnail);
  }

  // console.log(updatedProduct)

  return updatedProduct;
};

export const ProductServices = {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  createProduct,
  updateProduct,
};
