/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { EPaymentMethod } from "../order/order.interface";

export enum EPaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED"
}

export interface IPayment {
  userId: Types.ObjectId,
  orderId: Types.ObjectId;
  amount: number;
  transactionId:string;
  paymentMethod: EPaymentMethod;
  paymentGatewayData: any;
  invoiceUrl: string;
  status: EPaymentStatus
  
}