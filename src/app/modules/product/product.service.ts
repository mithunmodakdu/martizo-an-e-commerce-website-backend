import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { excludeFields, productSearchableFields } from "./product.constants";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import httpStatusCodes from "http-status-codes";

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
    .paginate();

  const [data, meta] = await Promise.all(
    [
      products.build(),
      queryBuilder.getMeta()
    ]
  );

  return {
    meta: meta,
    data: data,
  };
};

export const ProductServices = {
  createProduct,
  getAllProducts,
};
