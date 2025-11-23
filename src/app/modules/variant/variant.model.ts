import { model, Schema } from "mongoose";
import { IVariant } from "./variant.interface";

const VariantSchema = new Schema<IVariant>(
  {
    name: {type: String, required: true},
    value: {type: String, required: true},
    additionalPrice: {type: Number},
    stock: {type: Number}
  },
  {
    timestamps: true
  }
);

export const Variant = model("Variant", VariantSchema);