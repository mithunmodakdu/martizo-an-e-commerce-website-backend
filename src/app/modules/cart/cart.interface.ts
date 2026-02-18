import { Types } from "mongoose";
import { IVariant } from "../product/variant/variant.interface";

export interface IProductPrice {
  regular: number;
  sale?: number;
  currency: string;
}

export interface ICartItem {
  productId: Types.ObjectId;
  name: string;
  categoryName: string;
  price: IProductPrice;
  quantity: number;
  variant? : IVariant;
  image?: {src: string, alt: string};
  
}

export interface ICart {
  userId: Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  itemsPrice: number;
  
}