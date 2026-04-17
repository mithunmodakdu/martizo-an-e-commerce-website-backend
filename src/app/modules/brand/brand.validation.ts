import * as z from "zod";

export const CreateBrandZodSchema = z.object({
  name: z
    .string({ error: "Brand name must be string." })
    .min(2, { error: "Brand name must have at least 2 characters" }),
  slug: z.string().optional(),
  tagline: z.string({error: "Brand tagline must be string."}),
  totalProducts: z.number().int(),
  isTopBrand: z.boolean({ error: "isTopBrand must be boolean." }).optional(),
  isMartizoChoice: z
    .boolean({ error: "isMartizoChoice must be boolean." })
    .optional(),
  isFeatured: z.boolean({error: "isFeatured must be boolean."}).optional(),
  brandLogo: z.string({ error: "Brand logo must be string." }).optional(),

});

export const UpdateBrandZodSchema = z.object({
  name: z
    .string({ error: "Brand name must be string." })
    .min(2, { error: "Brand name must have at least 2 characters" })
    .optional(),
  slug: z.string().optional(),
  tagline: z.string({error: "Brand tagline must be string."}).optional(),
  totalProducts: z.number().int().optional(),
  isTopBrand: z.boolean({ error: "isTopBrand must be boolean." }).optional(),
  isMartizoChoice: z
    .boolean({ error: "isMartizoChoice must be boolean." })
    .optional(),
  isFeatured: z.boolean({error: "isFeatured must be boolean."}).optional(),
  brandLogo: z.string({ error: "Brand logo must be string." }).optional(),
});
