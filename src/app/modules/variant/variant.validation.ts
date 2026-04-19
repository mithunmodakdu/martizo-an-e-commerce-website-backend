import z from "zod";

export const VariantCreationZodSchema = z.object({
  name: z
    .string({ error: "Variant name must be string" })
    .min(2, { error: "Variant name cannot be less then 2 characters" }),
  value: z
    .string({ error: "Variant value must be string" })
    .min(2, { error: "Variant value cannot be less then 2 characters" }),
  additionalPrice: z.number({ error: "Additional Price must be a number" }).optional(),
  stock: z.number({ error: "stock must be a number" }).optional(),
  sku: z.string({ error: "sku must be string" }).optional(),
});
