import { IOrder } from "./order.interface";

const createOrder = async(payload: Partial<IOrder>) => {
  console.log(payload)
  return {}
}

export const OrderServices = {
  createOrder
}