import { Types } from "mongoose";
import { IVariant } from "../variant/variant.interface";
import { IProductPrice } from "../shared-interfaces-schemas";

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