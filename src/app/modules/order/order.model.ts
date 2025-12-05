import { model, Schema } from "mongoose";
import {
  EOrderStatus,
  EPaymentMethod,
  IOrder,
  IOrderItem,
  IShippingAddress,
} from "./order.interface";
import { VariantSchema } from "../product/variant/variant.model";

export const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    variant: { type: VariantSchema, default: null },
  },
  {
    _id: false,
  }
);

export const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  {
    _id: false,
  }
);

export const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shippingAddress: ShippingAddressSchema,

    items: [OrderItemSchema],
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },

    paymentMethod: {type: String, enum: Object.values(EPaymentMethod)},
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    status: {
      type: String,
      enum: Object.values(EOrderStatus),
      default: EOrderStatus.PENDING,
    },

    paidAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    refundedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);


export const Order = model<IOrder>("Order", OrderSchema);