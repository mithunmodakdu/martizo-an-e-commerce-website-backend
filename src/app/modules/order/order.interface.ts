import { Types } from "mongoose";
import { IVariant } from "../variant/variant.interface";
import { IProductPrice } from "../cart/cart.interface";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  categoryName: string;
  quantity: number;
  price: IProductPrice;
  variant?: IVariant | null;
  image?: {src: string, alt: string};
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
  OUT_FOR_DELIVERY ="OUT_FOR_DELIVERY", 
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED"
}

export interface IOrder {
  orderNo: string;
  invoiceNo: string;
  userId: Types.ObjectId;
  shippingAddress: IShippingAddress;

  items: IOrderItem[];
  itemsPrice : number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  
  paymentMethod: EPaymentMethod;
  paymentId?: Types.ObjectId;
  
  status: EOrderStatus;
 
  carrier?: string;             
  trackingNumber?: string;      
  lastLocation?: string;  

  paidAt?: Date | null;                
  processedAt?: Date | null;           
  shippedAt?: Date | null;              
  outForDeliveryAt?: Date | null;       
  deliveredAt?: Date | null;        
  estimatedDelivery?: Date | null;     

  cancelledAt?: Date | null;
  refundedAt?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
 
}