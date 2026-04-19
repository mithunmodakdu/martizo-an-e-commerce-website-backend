import { Types } from "mongoose";

export interface IWishListItem {
  productId: Types.ObjectId;
  addedAt: Date 
}

export interface IWishList {
  userId: Types.ObjectId;
  items: IWishListItem[];
 
}