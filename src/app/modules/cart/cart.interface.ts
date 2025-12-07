import { Types } from "mongoose";
import { IVariant } from "../product/variant/variant.interface";

export interface ICartItem {
  productId: Types.ObjectId;
  name: string;
  categoryName: string;
  price: number;
  quantity: number;
  variant? : IVariant;
  image?: string;
  
}

export interface ICart {
  userId: Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  itemsPrice: number;
  
}