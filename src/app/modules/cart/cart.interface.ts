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
  category: string;
  price: IProductPrice;
  quantity: number;
  image?: {src: string, alt: string};
  variant? : IVariant;
  
  
}

export interface ICart {
  userId: Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  itemsPrice: number;
  
}