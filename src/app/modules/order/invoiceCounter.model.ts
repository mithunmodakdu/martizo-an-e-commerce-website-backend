import { Schema, model } from "mongoose";

const invoiceCounterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export const InvoiceCounter = model("InvoiceCounter", invoiceCounterSchema);


export const generateInvoiceNo = async (): Promise<string> => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const invoiceCounter = await InvoiceCounter.findOneAndUpdate(
    { name: `invoice-${year}-${month}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `MZ-${year}${month}-${String(invoiceCounter.seq).padStart(4, "0")}`;
};