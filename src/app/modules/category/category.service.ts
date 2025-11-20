import AppError from "../../errorHelpers/AppError";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import httpStatusCodes from "http-status-codes";

const createCategory = async (payload: Partial<ICategory>) => {
  const existedCategory = await Category.findOne({ name: payload.name });

  if (existedCategory) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "This category already exist"
    );
  }

  const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-");
  let slug = `${baseSlug}-category`;

  let counter = 1;

  while (await Category.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }

  payload.slug = slug;

  const category = await Category.create(payload);
  return category;
};

export const CategoryServices = {
  createCategory,
};
