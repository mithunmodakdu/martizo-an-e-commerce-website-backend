import { Types } from "mongoose";
import { IVariant } from "../product/variant/variant.interface";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  categoryName: string;
  quantity: number;
  price: number;
  variant?: IVariant | null;
  image?: string | null;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  country?: string;
}

export enum EPaymentMethod {
  COD = "COD",                  // Cash on Delivery
  SSL_COMMERZ = "SSL_COMMERZ",  
  STRIPE = "STRIPE",            
  PAYPAL = "PAYPAL",            
  BKASH = "BKASH",              
  NAGAD = "NAGAD"               
}

export enum EOrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED"
}

export interface IOrder {
  userId: Types.ObjectId;
  shippingAddress: IShippingAddress;

  items: IOrderItem[];
  itemsPrice : number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  
  paymentMethod: EPaymentMethod;
  paymentId?: Types.ObjectId;
  status: EOrderStatus

  paidAt?: Date | null;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  cancelledAt?: Date | null;
  refundedAt?: Date | null;

}