import z from "zod";

export const createBrandZodSchema = z.object({
  name: z
    .string({ error: "Brand name must be string." })
    .min(2, { error: "Brand name must have at least 2 characters" }),
  slug: z.string().optional(),
  brandLogo: z.string({ error: "Brand logo must be string." }).optional(),
  isTopBrand: z.boolean({ error: "isTopBrand must be boolean." }).optional(),
  isMartizoChoice: z
    .boolean({ error: "isMartizoChoice must be boolean." })
    .optional(),
});
