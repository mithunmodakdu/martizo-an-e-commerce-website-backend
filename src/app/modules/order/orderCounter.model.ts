import { model, Schema } from "mongoose";

const orderCounterSchema = new Schema({
  name: {type: String, required: true, unique: true},
  serialNo: {type: Number, default: 0}
});

export const OrderCounter = model("OrderCounter", orderCounterSchema);

export const generateOrderNo = async(): Promise<string> => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); 

  const orderCounter = await OrderCounter.findOneAndUpdate(
    {name: `Order-${year}-${month}`},
    {$inc: {serialNo: 1}},
    {new: true, upsert: true}
  );

  return `MZ-ORD-${year}-${month}-${String(orderCounter.serialNo).padStart(4, "0")}`
}



