import z from "zod";

export const createOfferZodSchema = z.object({
  offerType: z.enum(
    ["TODAYS_OFFER", "CLEARANCE", "VOUCHER", "BUNDLE", "FLASH_SALE"],
    {
      error:
        "Invalid offer type. Allowed values: TODAYS_OFFER, CLEARANCE, VOUCHER, BUNDLE, FLASH_SALE",
    }
  ),
  discountPercentage: z
    .number({ error: "Discount percentage must be a number" })
    .min(0, "Discount percentage cannot be negative")
    .max(100, "Discount percentage cannot exceed 100"),
  startDate: z.coerce
    .date({ error: "Start date must be a valid date" })
    .optional(),
  endDate: z.coerce.date({ error: "End date must be a valid date" }).optional(),
  voucherCode: z
    .string({ error: "Voucher code must be a string" })
    .min(3, "Voucher code must be at least 3 characters")
    .optional(),
});
