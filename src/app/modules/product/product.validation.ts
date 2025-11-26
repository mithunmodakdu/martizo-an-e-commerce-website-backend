import z from "zod";
import { VariantCreationZodSchema } from "./variant/variant.validation";

export const ProductCreationZodSchema = z.object({
  // main details
  title: z
    .string({ error: "Product title must be string" })
    .min(2, { error: "Title must be at least 2 characters" }),
  description: z
    .string({ error: "Product description must be string" })
    .optional(),

  // categorization
  category: z
    .string({ error: "Category ID is required" })
    .min(1, { error: "Category ID cannot be empty" }),
  subCategory: z.string().optional(),
  brand: z.string().optional(),

  // price section
  price: z
    .number({ error: "Price must be a number" })
    .positive("Price must be a positive number"),

  salePrice: z
    .number({ error: "Sale Price must be a number" })
    .positive("Sale price must be a positive number")
    .optional(),

  discountPercentage: z
    .number()
    .min(0, "Discount percentage cannot be negative")
    .max(100, "Discount percentage cannot exceed 100")
    .optional(),

  // stock
  stock: z
    .number({ error: "Stock quantity must be a number" })
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),

  // variants
  variants: z
    .array(VariantCreationZodSchema, { error: "Variants must be an array" })
    .optional(),

  // media
  thumbnail: z
    .string({ error: "Thumbnail image URL must be string" })
    .min(1, "Thumbnail cannot be empty"),

  images: z.array(z.string()).optional(),

  // shop labels
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isFlashSale: z.boolean().optional(),
  isMartizoExclusive: z.boolean().optional(),
  isTrending: z.boolean().optional(),

  // offers
  offers: z
    .array(z.string(), {
      error: "Offers must be an array of Offer IDs",
    })
    .optional(),

  // ratings
  rating: z
    .number("Rating must be a number")
    .min(0, "Rating cannot be negative")
    .max(5, "Rating cannot exceed 5")
    .optional(),

  ratingCount: z
    .number("Rating count must be a number")
    .int("Rating count must be an integer")
    .min(0, "Rating count cannot be negative")
    .optional(),

  // sku
  sku: z.string({ error: "SKU must be string" }).min(1, "SKU cannot be empty"),

  // status
  status: z
    .enum(["ACTIVE", "INACTIVE"], {
      error: "Status must be ACTIVE or INACTIVE",
    })
    .optional(),
});
