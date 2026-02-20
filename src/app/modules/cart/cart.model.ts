import { model, Schema } from "mongoose";
import { ICart, ICartItem } from "./cart.interface";
import { VariantSchema } from "../product/variant/variant.model";

export const PriceSchema = new Schema(
  {
    regular: { type: Number, required: true },
    sale: { type: Number },
    currency: { type: String, required: true },
  },
  {
    _id: false,
  },
);



export const CartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: PriceSchema,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
     image: {
      src: String,
      alt: String
    },
    variant: {
      type: VariantSchema,
    }
   
  },
  {
    _id: false,
  },
);

export const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    itemsPrice: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

CartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  this.itemsPrice = this.items.reduce(
    (total, item) => total + item.quantity * (item.price.sale?? item.price.regular),
    0,
  );

  next();
});

export const Cart = model("Cart", CartSchema);
