import z from "zod";
import { VariantCreationZodSchema } from "../product/variant/variant.validation";


export const OrderItemZodSchema = z.object({
  productId: z
    .string({ error: "Product ID must be a string" })
    .min(1, { error: "Product ID is required" }),
  name: z
    .string({ error: "Product name must be a string" })
    .min(1, { error: "Product name is required" }),
  quantity: z
    .number({ error: "Quantity must be a number" })
    .min(1, { error: "Quantity must be at least 1" }),
  price: z
    .number({ error: "Price must be a number" })
    .min(0, { error: "Price must be 0 or more" }),
  variant: VariantCreationZodSchema.optional(),
  image: z.string().optional(),
});
