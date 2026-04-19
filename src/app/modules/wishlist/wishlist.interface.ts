import { Types } from "mongoose";

export interface IWishListItem {
  productId: Types.ObjectId;
  name: string;
  image: { src: string; alt: string };
  variantId?: Types.ObjectId;
  addedAt: Date 
}

export interface IWishList {
  userId: Types.ObjectId;
  items: IWishListItem[];
 
}