import { model, Schema } from "mongoose";
import { IWishList, IWishListItem } from "./wishlist.interface";

const WishListItemSchema = new Schema<IWishListItem>(
  {
    productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
    addedAt: {type: Date, required: true}
  },
  {
    _id: false
  }
);

const WishlistSchema = new Schema<IWishList>(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    items: {type: [WishListItemSchema], default: [] }
  },
  {
    timestamps: true
  }
);

export const Wishlist = model("Wishlist", WishlistSchema);