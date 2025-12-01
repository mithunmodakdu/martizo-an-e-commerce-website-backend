import { model, Schema } from "mongoose";
import { ICart, ICartItem } from "./cart.interface";
import { VariantSchema } from "../product/variant/variant.model";

export const CartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    variant: {
      type: VariantSchema
    },
    image: {
      type: String
    }

  },
  {
    _id: false
  }
);

export const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    items: {
      type: [CartItemSchema],
      default: []
    },
    totalItems: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Cart = model("Cart", CartSchema); 