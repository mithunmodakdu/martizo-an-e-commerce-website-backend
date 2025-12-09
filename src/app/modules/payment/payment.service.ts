import { EOrderStatus } from "../order/order.interface";
import { Order } from "../order/order.model";
import { SSLCommerzServices } from "../sslCommerz/sslCommerz.service";
import { IUser } from "../user/user.interface";
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

    await Order.findByIdAndUpdate(
      updatedPayment?.orderId,
      {
        status: EOrderStatus.PAID,
      },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment completed successfully",
    };
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

    await Order.findByIdAndUpdate(
      updatedPayment?.orderId,
      {
        status: EOrderStatus.FAILED,
      },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment failed.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: EPaymentStatus.CANCELLED },
      { new: true, runValidators: true, session }
    );

    await Order.findByIdAndUpdate(
      updatedPayment?.orderId,
      {
        status: EOrderStatus.CANCELLED,
      },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment cancelled.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const initPayment = async (orderId: string) => {
  const order = await Order.findById(orderId);
  const { name, email } = order?.userId as Partial<IUser>;

  let productName = "";
  order?.items.map((item) => (productName += item.name + ", "));

  let productCategory = "";
  order?.items.map((item) => (productCategory += item.categoryName + ", "));

  const payment = await Payment.findById(order?.paymentId);

  const sslPayload = {
    total_amount: order?.totalPrice as number,
    tran_id: payment?.transactionId as string,
    product_name: productName as string,
    product_category: productCategory as string,
    cus_name: name as string,
    cus_email: email as string,
    cus_add1: order?.shippingAddress?.address as string,
    cus_city: order?.shippingAddress?.city as string,
    cus_postcode: order?.shippingAddress?.postalCode as string,
    cus_country: order?.shippingAddress?.country as string,
    cus_phone: order?.shippingAddress?.phone as string,
  };

  const sslPayment = await SSLCommerzServices.sslPaymentInit(sslPayload);

  return {
    paymentGateWayUrl: sslPayment.GatewayPageURL,
  };
};

export const PaymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
