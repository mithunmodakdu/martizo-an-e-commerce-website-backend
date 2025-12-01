import { Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export enum EOrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface IOrder {
  userId: Types.ObjectId;
  shippingAddress: IShippingAddress;

  items: IOrderItem[];
  totalAmount: number;
  
  paymentId: Types.ObjectId;
  status: EOrderStatus
}