import z from "zod";
import { VariantCreationZodSchema } from "../product/variant/variant.validation";
import { EOrderStatus } from "./order.interface";

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

export const ShippingAddressZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, {
      message: "Name is too short. It must have minimum 2 characters.",
    })
    .max(50, {
      message: "Name is too long. It must have maximum 50 characters.",
    }),
  phone: z
    .string({ message: "Phone number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh.   Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .min(1, { error: "Phone number is required" }),
  address: z
    .string({ error: "Address must be a string" })
    .min(2, { error: "Address is required" })
    .max(200, { message: "Address can not exceed 200 characters" }),
  city: z.string({ error: "City must be a string" }).optional(),
  postalCode: z.string({ error: "Postal code must be a string" }).optional(),
  country: z.string({ error: "Country must be a string" }).optional(),
});

export const CreateOrderZodSchema = z.object({
  userId: z
    .string({ error: "User ID must be a string" })
    .min(1, { error: "User ID is required" }),
  shippingAddress: ShippingAddressZodSchema,

  items: z
    .array(OrderItemZodSchema)
    .min(1, { error: "At least one order item is required" }),
  itemsPrice: z
    .number({ error: "Items price must be a number" })
    .min(0, { error: "Items price must be 0 or more" }),
  taxPrice: z
    .number({ error: "Tax price must be a number" })
    .min(0, { message: "Tax price must be 0 or more" }),
  shippingPrice: z
    .number({ error: "Shipping price must be a number" })
    .min(0, { message: "Shipping price must be 0 or more" }),
  totalPrice: z
    .number({ error: "Total price must be a number" })
    .min(0, { message: "Total price must be 0 or more" }),

  paymentId: z.string({ error: "Payment ID must be a string" }).optional(),
  status: z
    .enum(Object.values(EOrderStatus) as [string], {
      error: "Invalid order status",
    })
    .optional(),

  paidAt: z.string().optional(),
  shippedAt: z.string().optional(),
  deliveredAt: z.string().optional(),
  cancelledAt: z.string().optional(),
  refundedAt: z.string().optional(),
});
