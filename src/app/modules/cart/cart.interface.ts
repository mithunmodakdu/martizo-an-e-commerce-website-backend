import { Types } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart {
  userId: Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
}