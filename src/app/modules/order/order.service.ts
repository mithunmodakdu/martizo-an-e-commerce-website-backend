import AppError from "../../errorHelpers/AppError";
import { Cart } from "../cart/cart.model";
import { IOrder} from "./order.interface";
import httpStatusCodes from "http-status-codes";
import { Order } from "./order.model";

const createOrder = async (userId: string, payload: Partial<IOrder>) => {
  const {shippingAddress, paymentMethod} = payload;
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
  })) ;

  const taxPrice = cart.itemsPrice * 0.15;
  const shippingPrice = (payload.shippingAddress?.city)?.toLowerCase() === "dhaka"? 60 : 120;
  const totalPrice = cart.itemsPrice + taxPrice + shippingPrice;

  const orderData = {
    userId,
    shippingAddress,
    paymentMethod,
    items: orderItems,
    itemsPrice: cart.itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
    
  }
  
  const order = await Order.create(orderData);

  cart.items = [];
  await cart.save();

  return order;
};

export const OrderServices = {
  createOrder,
};
