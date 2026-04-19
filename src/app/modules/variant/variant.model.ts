import { Schema } from "mongoose";
import { IVariant } from "./variant.interface";

export const VariantSchema = new Schema<IVariant>(
  {
    name: {type: String, required: true},
    value: {type: String, required: true},
    additionalPrice: {type: Number},
    stock: {type: Number},
    images: [String],
    sku: String
  },
  {
    _id: false
  }
);

