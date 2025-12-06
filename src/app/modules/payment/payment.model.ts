import { model, Schema } from "mongoose";
import { EPaymentMethod } from "../order/order.interface";
import { EPaymentStatus, IPayment } from "./payment.interface";

const PaymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    orderId: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(EPaymentMethod),
      required: true,
    },
    paymentGatewayData: { type: Schema.Types.Mixed },
    invoiceUrl: { type: String },
    status: { type: String, enum: Object.values(EPaymentStatus), default: EPaymentStatus.UNPAID },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment>("Payment", PaymentSchema); 
