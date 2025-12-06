import AppError from "../../errorHelpers/AppError";
import { Cart } from "../cart/cart.model";
import { IOrder } from "./order.interface";
import httpStatusCodes from "http-status-codes";
import { Order } from "./order.model";
import { User } from "../user/user.model";
import { Payment } from "../payment/payment.model";
import { EPaymentStatus } from "../payment/payment.interface";

const createTransactionId = () => {
  return `tran_id_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
// console.log(createTransactionId())

const createOrder = async (userId: string, payload: Partial<IOrder>) => {
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

  const order = await Order.create(orderData);

  const payment = await Payment.create({
    userId,
    orderId: order._id,
    amount: order.totalPrice,
    transactionId: createTransactionId(),
    paymentMethod,
    status: EPaymentStatus.UNPAID,
  });

  const updatedOrder = await Order.findByIdAndUpdate(
    order._id,
    { paymentId: payment._id },
    { new: true, runValidators: true }
  )
    .populate("userId", "name email")
    .populate("paymentId");

  cart.items = [];
  await cart.save();

  return updatedOrder;
};

export const OrderServices = {
  createOrder,
};
