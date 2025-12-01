/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum EPaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED"
}

export interface IPayment {
  orderId: Types.ObjectId;
  amount: number;
  transactionId:string;
  paymentGatewayData: any;
  invoiceUrl: string;
  status: EPaymentStatus
  
}