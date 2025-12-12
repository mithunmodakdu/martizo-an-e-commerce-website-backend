import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
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

  const category = await Category.create(payload);
  return category;
};

const updateCategory = async(id: string, payload: Partial<ICategory>) =>{
  const existedCategory = await Category.findById(id);
  
  if(!existedCategory){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "This category does not exist.")
  }

  const duplicateCategory = await Category.findOne({name: payload.name, _id: {$ne: id}});

  if(duplicateCategory){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Category with same name already exists");
  }

  if(payload.icon && existedCategory.icon){
    await deleteImageFromCloudinary(existedCategory.icon);
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, payload, {new: true, runValidators: true});

  return updatedCategory;
}

export const CategoryServices = {
  createCategory,
  updateCategory
};
