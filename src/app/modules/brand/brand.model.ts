import { model, Schema } from "mongoose";
import { IBrand } from "./brand.interface";

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isTopBrand: {type: Boolean, default: false},
    isMartizoChoice: {type: Boolean, default: false},
    brandLogo: {type: Boolean}
  },
  {
    timestamps: true,
  }
);

export const Brand = model<IBrand>("Brand", BrandSchema);
