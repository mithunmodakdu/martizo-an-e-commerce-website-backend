import { EOrderStatus } from "../order/order.interface";
import { Order } from "../order/order.model";
import { EPaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: EPaymentStatus.PAID },
      { new: true, runValidators: true, session }
    );

    await Order.findByIdAndUpdate(updatedPayment?.orderId, 
      {
        status: EOrderStatus.PAID,
      },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession()

    return {
      success: true,
      message: "Payment completed successfully"
    }

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

};

const failPayment = async (query: Record<string, string>) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: EPaymentStatus.FAILED },
      { new: true, runValidators: true, session }
    );

    await Order.findByIdAndUpdate(updatedPayment?.orderId, 
      {
        status: EOrderStatus.FAILED,
      },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession()

    return {
      success: false,
      message: "Payment failed."
    }

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

};

export const PaymentServices = {
  successPayment,
  failPayment
};
