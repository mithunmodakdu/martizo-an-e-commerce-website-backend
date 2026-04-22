import { Schema } from "mongoose";
import z from "zod";

export interface IProductPrice {
  regular: number;
  sale?: number;
  currency: string;
}

export const ProductPriceSchema = new Schema<IProductPrice>(
  {
    regular: {type: Number, required: true},
    sale: {type: Number},
    currency: {type: String, required: true}
  },
  {
    _id: false
  }
)

export const ProductPriceZodSchema = z.object({
  regular:  z
      .number({ error: "Regular Price must be a number" })
      .positive("Price must be a positive number"),
  sale: z
      .union([z.number({ error: "Sale Price must be a number" }).min(0), z.undefined()])
      .optional(),
  currency: z.string({ error: "Currency must be a number" })
})

export const ProductPriceUpdateZodSchema = z.object({
  regular:  z
      .number({ error: "Regular Price must be a number" })
      .positive("Price must be a positive number")
      .optional(),
  sale: z
      .union([z.number({ error: "Sale Price must be a number" }).min(0), z.undefined()])
      .optional(),
  currency: z.string({ error: "Currency must be a number" }).optional()
})