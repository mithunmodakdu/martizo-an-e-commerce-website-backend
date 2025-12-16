import AppError from "../../errorHelpers/AppError";
import { generateInvoicePDF, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { EOrderStatus, IOrder } from "../order/order.interface";
import { Order } from "../order/order.model";
import { SSLCommerzServices } from "../sslCommerz/sslCommerz.service";
import { IUser } from "../user/user.interface";
import { EPaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatusCodes from "http-status-codes";

const successPayment = async (query: Record<string, string>) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: EPaymentStatus.PAID },
      { new: true, runValidators: true, session }
    );

    const updatedOrder = await Order.findByIdAndUpdate(
      updatedPayment?.orderId,
      {
        status: EOrderStatus.PAID,
      },
      { new: true, runValidators: true, session }
    ).populate("userId", "name email address city phone");

    if(!updatedOrder){
      throw new AppError(httpStatusCodes.NOT_FOUND, "Updated Order is NOT  Found")
    }

    const invoiceData: IInvoiceData = {
      invoiceNo: updatedOrder.invoiceNo,
      date:  new Date(updatedOrder.createdAt as Date).toLocaleDateString("en-GB"),
      customerInfo: {
        name: (updatedOrder.userId as unknown as IUser).name,
        email: (updatedOrder.userId as unknown as IUser).email,
        address: (updatedOrder.userId as unknown as IUser).address as string,
        city: (updatedOrder.userId as unknown as IUser).city as string,
        phone: (updatedOrder.userId as unknown as IUser).phone as string
      },
      shippingInfo: {
        name: updatedOrder.shippingAddress.name,
        address: updatedOrder.shippingAddress.address,
        city: updatedOrder.shippingAddress.city,
        phone: updatedOrder.shippingAddress.phone,
      },
      items: updatedOrder.items,
      subtotal: updatedOrder.itemsPrice,
      shippingCost: updatedOrder.shippingPrice,
      tax: updatedOrder.taxPrice,
      total: updatedOrder.totalPrice
    };

    const pdfBuffer = await generateInvoicePDF(invoiceData);

    await sendEmail({
      to: (updatedOrder.userId as unknown as IUser).email,
      subject: "Invoice of Your Purchase",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    })



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
