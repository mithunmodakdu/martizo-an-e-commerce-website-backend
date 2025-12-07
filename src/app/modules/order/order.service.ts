import AppError from "../../errorHelpers/AppError";
import { Cart } from "../cart/cart.model";
import { IOrder } from "./order.interface";
import httpStatusCodes from "http-status-codes";
import { Order } from "./order.model";
import { User } from "../user/user.model";
import { Payment } from "../payment/payment.model";
import { EPaymentStatus } from "../payment/payment.interface";
import { IUser } from "../user/user.interface";
import { SSLCommerzServices } from "../sslCommerz/sslCommerz.service";

const createTransactionId = () => {
  return `tran_id_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
// console.log(createTransactionId())

const createOrder = async (userId: string, payload: Partial<IOrder>) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const { shippingAddress, paymentMethod } = payload;

    if (!shippingAddress) {
      const user = await User.findOne({ _id: userId });

      if (!user?.phone || !user.address) {
        throw new AppError(
          httpStatusCodes.BAD_REQUEST,
          "Please update your profile with phone number and address."
        );
      }
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      throw new AppError(httpStatusCodes.BAD_REQUEST, "Your cart is empty.");
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      categoryName: item.categoryName,
      quantity: item.quantity,
      price: item.price,
      variant: item.variant,
    }));

    const taxPrice = cart.itemsPrice * 0.15;
    const shippingPrice =
      payload.shippingAddress?.city?.toLowerCase() === "dhaka" ? 60 : 120;
    const totalPrice = cart.itemsPrice + taxPrice + shippingPrice;

    const orderData = {
      userId,
      shippingAddress,
      paymentMethod,
      items: orderItems,
      itemsPrice: cart.itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    const order = await Order.create([orderData], { session });

    //create payment
    const payment = await Payment.create(
      [
        {
          userId,
          orderId: order[0]._id,
          amount: order[0].totalPrice,
          transactionId: createTransactionId(),
          paymentMethod,
          status: EPaymentStatus.UNPAID,
        },
      ],
      { session }
    );

    // update Order
    const updatedOrder = await Order.findByIdAndUpdate(
      order[0]._id,
      { paymentId: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("userId", "name email address")
      .populate("paymentId", "transactionId");

  
    //make cart empty
    cart.items = [];
    await cart.save({ session });

    // SSL Payment related
    const { name, email } =
      updatedOrder?.userId as Partial<IUser>;

    let productName = "";
    updatedOrder?.items.map((item) => (productName += item.name + ", "));

    let productCategory = "";
    updatedOrder?.items.map(
      (item) => (productCategory += item.categoryName + ", ")
    );

    const sslPayload = {
      total_amount: updatedOrder?.totalPrice as number,
      tran_id: payment[0]?.transactionId as string,
      product_name: productName as string,
      product_category: productCategory as string,
      cus_name: name as string,
      cus_email: email as string,
      cus_add1: shippingAddress?.address as string,
      cus_city: shippingAddress?.city as string,
      cus_postcode: shippingAddress?.postalCode as string,
      cus_country: shippingAddress?.country as string,
      cus_phone: shippingAddress?.phone as string,
    };

    const sslPayment = await SSLCommerzServices.sslPaymentInit(sslPayload);

    await session.commitTransaction();
    session.endSession();

    return {
      order: updatedOrder,
      paymentGateWayUrl: sslPayment.GatewayPageURL
    };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const OrderServices = {
  createOrder,
};
