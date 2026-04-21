import AppError from "../../errorHelpers/AppError";
import { IWishListItem } from "./wishlist.interface";
import { Wishlist } from "./wishlist.model"
import httpStatusCodes from "http-status-codes";

const removeFromWishlist = async(userId: string, productId: string) => {
  const wishlist = await Wishlist.findOne({userId});
  if(!wishlist){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Your wishlist is not found.")
  }

  const item = wishlist.items.find((item) => String(item.productId) === productId);
  if(!item){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "This product is not found in your wishlist.")
  }

  wishlist.items = wishlist.items.filter((item) => String(item.productId) !== productId);

  await wishlist.save();

  return wishlist;
}

const getWishlist = async(userId: string) => {
  const wishlist = await Wishlist.findOne({userId}).populate("items.productId");
  return wishlist;
}

const addToWishlist = async(userId: string, payload: Partial<IWishListItem>) => {
  
  let wishlist = await Wishlist.findOne({userId});

  if(!wishlist){
    wishlist = await Wishlist.create({
      userId,
      items: [{productId: payload.productId, addedAt: payload.addedAt}]
    })
  }else{
    const item = wishlist.items.find((item) => item.productId === payload.productId)

    if(item){
      throw new AppError(httpStatusCodes.BAD_REQUEST, "This product is already in your wishlist")
    }else{
      wishlist.items.push({productId: payload.productId, addedAt: payload.addedAt} as IWishListItem)
    }
  }

  await wishlist.save();

  return wishlist;
}

export const WishlistServices = {
  removeFromWishlist,
  getWishlist,
  addToWishlist
} 