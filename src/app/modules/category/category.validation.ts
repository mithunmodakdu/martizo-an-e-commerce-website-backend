import z from "zod";

export const createCategoryZodSchema = z.object({
  name: z
    .string({ error: "Category name must be string" })
    .min(2, { error: "Category name must be of at least 2 characters" }),
  slug: z
    .string()
    .min(3, { error: "Category slug must be of at least 3 characters" })
    .optional(),
  parent: z.string().optional(),
});
