import z from "zod";
import { VariantCreationZodSchema } from "../product/variant/variant.validation";
import { EOrderStatus, EPaymentMethod } from "./order.interface";

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
  city: z.string({ error: "City must be a string" }),
  postalCode: z.string({ error: "Postal code must be a string" }).optional(),
  country: z.string({ error: "Country must be a string" }).optional(),
  
});

export const CreateOrderZodSchema = z.object({
  shippingAddress: ShippingAddressZodSchema,
  paymentMethod: z.enum(Object.values(EPaymentMethod) as [string]),
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
  invoiceNo: z.string({ error: "invoiceNo must be a string" }).optional(),
});
