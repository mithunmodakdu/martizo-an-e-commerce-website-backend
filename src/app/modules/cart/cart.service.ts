import { ICartItem } from "./cart.interface";
import { Cart } from "./cart.model";

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

export const CartServices = {
  addToCart,
  getUserCart
};
