import AppError from "../../errorHelpers/AppError";
import { ICartItem } from "./cart.interface";
import { Cart } from "./cart.model";
import httpStatusCodes from "http-status-codes";
import { Category } from "../category/category.model";

const addToCart = async (userId: string, payload: Partial<ICartItem>) => {
  const { productId, name, category, quantity, price } = payload;

  const categoryOfProduct = await Category.findOne({_id: category});

  if(!categoryOfProduct){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "No category found")
  }
  const {name : categoryName} = categoryOfProduct;
  
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ productId, name, categoryName,  quantity, price }],
    });
  } else {
    const item = cart.items.find((item) => item.productId == productId);

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId, name, categoryName, quantity: 1, price });
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

const removeCartItem = async(userId: string, productId: string) => {
  const cart = await Cart.findOne({userId});

  if(!cart){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Cart Not Found");
  }

  cart.items = cart.items.filter((item) => item.productId != productId);

  await cart.save();

  return cart;
}

const clearCart = async(userId: string) => {
  const cart = await Cart.findOne({userId});

  if(!cart){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "Cart Not Found");
  }

  cart.items = [];

  await cart.save();

  return cart;
}

export const CartServices = {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
