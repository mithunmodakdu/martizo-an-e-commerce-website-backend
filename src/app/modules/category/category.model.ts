import { model, Schema } from "mongoose";
import { ICategory } from "./category.interface";

export const categorySchema = new Schema<ICategory>(
  {
    name: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    parent: {type: Schema.Types.ObjectId, ref: "Category", default: null},
    icon: String
  },
  {
    timestamps: true
  }
);

export const Category = model("Category", categorySchema);