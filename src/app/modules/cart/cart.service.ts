import AppError from "../../errorHelpers/AppError";
import { ICartItem } from "./cart.interface";
import { Cart } from "./cart.model";
import httpStatusCodes from "http-status-codes";

const addToCart = async (userId: string, payload: Partial<ICartItem>) => {
  const { productId, name, quantity, price } = payload;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ productId, name, quantity, price }],
    });
  } else {
    const item = cart.items.find((item) => item.productId == productId);

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId, name, quantity: 1, price });
    }
  }

  await cart.save();

  return cart;
};

const getUserCart = async(userId: string) => {
  const cart = await Cart.findOne({userId});
  return cart;
}

const updateCartItem = async(userId: string, payload: Partial<ICartItem>) => {
  const {productId, quantity} = payload;
  const cart = await Cart.findOne({userId});

  if(!cart){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Cart Not Found");
  }

  const item = cart.items.find((item) => item.productId == productId);

  if(!item){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "This product item in not found in the cart")
  }

  item.quantity = quantity as number;

  await cart.save();

  return cart;
}

export const CartServices = {
  addToCart,
  getUserCart,
  updateCartItem
};
