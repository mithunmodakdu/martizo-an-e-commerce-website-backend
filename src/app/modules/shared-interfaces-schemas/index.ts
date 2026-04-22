import { Schema } from "mongoose";

export interface IProductPrice {
  regular: number;
  sale?: number;
  currency: string;
}

export const ProductPriceSchema = new Schema<IProductPrice>(
  {
    regular: {type: Number, required: true},
    sale: {type: Number},
    currency: {type: String, required: true}
  },
  {
    _id: false
  }
)